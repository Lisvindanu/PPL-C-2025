/**
 * Socket.IO Service
 * Mengelola koneksi real-time, autentikasi, dan event emitting.
 */

const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

class SocketService {
    constructor(server) {
        this.onlineUsers = new Map();
        this.setupSocketEvents();
    }

    async isUserOnline(userId) {
        return this.onlineUsers.has(userId);
    }

    /**
   * Inisialisasi Socket.IO server
   * @param {http.Server} httpServer - Server HTTP Express
   */

    init(httpServer) {
        this.io = new Server(httpServer, {
            cors: {
                origin: process.env.FRONTEND_URL || "http://localhost:5137",
                credentials: true
            }
        });

        this.setupMiddleware();
        this.setupEventHandlers();

        console.log('✅ Socket.IO Service Initialized');
        return this.io;
    }

    /**
   * Middleware untuk autentikasi socket
   */
    setupMiddleware() {
        this.io.use((socket, next) => {
            // 1. Coba ambil token dari 'auth' object (cara client modern)
            let token = socket.handshake.auth.token;

            // 2. JIKA GAGAL, coba ambil dari 'headers' 
            if (!token && socket.handshake.headers.authorization) {
                const authHeader = socket.handshake.headers.authorization;
                if (authHeader && authHeader.startsWith('Bearer ')) {
                    token = authHeader.substring(7); // Ambil token setelah "Bearer "
                }
            }

            // 3. Jika masih tidak ada token, tolak
            if (!token) {
                return next(new Error('Autentikasi gagal: Token tidak ditemukan (di auth/headers)'));
            }

            // 4. Verifikasi token
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                socket.userId = decoded.userId;
                next();
            } catch (err) {
                next(new Error('Autentikasi gagal: Token tidak valid'));
            }
        });
    }

    /**
   * Setup listener untuk event dari client
   */
    setupEventHandlers() {
        this.io.on('connection', (socket) => {
            console.log(`🎉 User connected: ${socket.userId}`);
            // user join room pribadi
            socket.join(`user:${socket.userId}`);
            // handle join room percakapan
            socket.on('chat:join-conversation', (percakapanId) => {
                socket.join(`conversation:${percakapanId}`);
                console.log(`User ${socket.userId} joined room conversation:${percakapanId}`);
            });

            // Handle 'Typing' indicator
            socket.on('chat:typing', (data) => {
                socket.to(`conversation:${data.conversationId}`).emit('chat:typing-indicator', {
                    userId: socket.userId,
                    isTyping: data.isTyping
                });
            });

            // Handle disconnect
            socket.on('disconnect', () => {
                console.log(`🔌 User disconnected: ${socket.userId}`);
            });
        });
    }

    /**
   * Method untuk di-panggil dari Use Case (SendMessage)
   * @param {string} percakapanId
   * @param {object} message
   */
    emitNewMessage(percakapanId, message) {
        // kirim pesan baru ke semua client di room percakapan
        this.io.to(`conversation:${percakapanId}`).emit('chat:new-message', message);
    }

    /**
   * Method untuk di-panggil dari Use Case (SendNotification)
   * @param {string} userId
   * @param {object} notification
   */
    emitNewNotification(userId, notification) {
        // Kirim notifikasi ke room pribadi user
        this.io.to(`user:${userId}`).emit('notification:new', notification);
    }
}

module.exports = new SocketService();
