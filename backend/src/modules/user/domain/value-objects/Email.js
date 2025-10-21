class Email {
  constructor(value) {
    if (!Email.isValid(value)) {
      throw new Error('Invalid email format');
    }
    this.value = value.toLowerCase();
  }

  static isValid(value) {
    if (!value || typeof value !== 'string') return false;
    // Simple RFC 5322 compliant-ish regex
    const regex = /[^\s@]+@[^\s@]+\.[^\s@]+/;
    return regex.test(value);
  }
}

module.exports = Email;


