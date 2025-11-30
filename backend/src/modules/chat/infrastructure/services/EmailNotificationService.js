

class EmailNotificationService {
    /**
     * @param {object} userRepository 
     * @param {object} emailService 
     */
    constructor(userRepository, emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    async sendNewMessageNotification(receiverId, senderId, message) {
        // 1. Ambil data pengirim dan penerima
        const [receiver, sender] = await Promise.all([
            this.userRepository.findById(receiverId),
            this.userRepository.findById(senderId)
        ]);

        if (!receiver || !sender) {
            console.warn(`[Notification] Penerima atau Pengirim tidak ditemukan.`);
            return;
        }

        const receiverEmail = receiver.email;
        const senderName = `${sender.nama_depan} ${sender.nama_belakang}`;
        const subject = `Pesan Baru dari ${senderName} di SkillConnect`;

        let messageText = message.pesan;
        if (message.tipe !== 'text') {
            messageText = `[${message.tipe.toUpperCase()}]: ${message.pesan.substring(0, 50)}...`;
        }

        const htmlBody = `
        <p>Halo <b>${receiver.nama_depan}</b>,</p>
        <p>Anda punya pesan baru yang belum dibaca dari <b>${senderName}</b>:</p>
        <div style="border: 1px solid #eee; padding: 15px; margin: 15px 0; background: #f9f9f9;">
        <p style="margin: 0; font-style: italic;">"${messageText}"</p>
        </div>
        <p>Pesan ini dikirim karena Anda sedang tidak online di SkillConnect.</p>
        <p>Silakan <a href="[LINK_CHAT_APP]">buka aplikasi SkillConnect</a> untuk membalas pesan.</p>
        <p>Terima kasih,<br>Tim SkillConnect</p>
    `;

        // 2. Kirim email menggunakan EmailService yang diinjeksi
        try {
            await this.emailService.sendMail({
                to: receiverEmail,
                subject: subject,
                html: htmlBody
            });
            console.log(`[Email Sent] Notifikasi pesan baru ke ${receiverEmail}`);
        } catch (error) {
            console.error(`Gagal mengirim email notifikasi ke ${receiverEmail}:`, error);

            throw new Error('Gagal mengirim notifikasi email.');
        }
    }
}

module.exports = EmailNotificationService;