class ModerationService {
  constructor() {
    this.bannedWords = [
      'kata_kasar1',
      'kata_kasar2',
      'anjing',
      'bangsat',
      'tolol',
      'kontol'
    ];
  }

  /**
   * Cek apakah teks mengandung kata terlarang
   * @param {string} text
   * @returns {boolean}
   */
  containsBannedWords(text = '') {
    if (!text) return false;
    return this.bannedWords.some(word =>
      text.toLowerCase().includes(word.toLowerCase())
    );
  }

  /**
   * Sensor kata-kata terlarang dengan mengganti menjadi ***
   * @param {string} text
   * @returns {string}
   */
  moderate(text = '') {
    if (!text) return text;
    let moderated = text;
    this.bannedWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      moderated = moderated.replace(regex, '***');
    });
    return moderated;
  }

  /**
   * Moderasi teks secara otomatis dengan laporan
   * @param {string} text
   * @returns {{ moderated: string, flagged: boolean }}
   */
  autoModerate(text = '') {
    const flagged = this.containsBannedWords(text);
    const moderated = this.moderate(text);
    return { moderated, flagged };
  }
}

module.exports = ModerationService;
