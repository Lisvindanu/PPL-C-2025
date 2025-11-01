/**
 * Message Entity
 * Domain model untuk pesan chat
 */

class Message {
  constructor({
    id,
    percakapan_id,
    pengirim_id,
    isi_pesan,
    tipe_pesan,
    attachment_url,
    is_read,
    dibaca_pada,
    created_at,
    updated_at
  }) {
    this.id = id;
    this.percakapan_id = percakapan_id;
    this.pengirim_id = pengirim_id;
    this.isi_pesan = isi_pesan;
    this.tipe_pesan = tipe_pesan; // 'text', 'image', 'file', 'system'
    this.attachment_url = attachment_url;
    this.is_read = is_read;
    this.dibaca_pada = dibaca_pada;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // Business logic
  isText() {
    return this.tipe_pesan === 'text';
  }

  hasAttachment() {
    return ['image', 'file'].includes(this.tipe_pesan);
  }

  isSystemMessage() {
    return this.tipe_pesan === 'system';
  }

  markAsRead() {
    this.is_read = true;
    this.dibaca_pada = new Date();
  }
}

module.exports = Message;
