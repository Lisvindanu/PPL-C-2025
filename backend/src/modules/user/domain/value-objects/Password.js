class Password {
  constructor(value) {
    if (!Password.isStrong(value)) {
      throw new Error('Password does not meet strength requirements');
    }
    this.value = value;
  }

  static isStrong(value) {
    if (!value || typeof value !== 'string') return false;
    // At least 8 chars, include letters and numbers
    const lengthOk = value.length >= 8;
    const hasLetter = /[A-Za-z]/.test(value);
    const hasNumber = /\d/.test(value);
    return lengthOk && hasLetter && hasNumber;
  }
}

module.exports = Password;


