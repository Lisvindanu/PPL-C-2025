class Rating {
  constructor(value) {
    if (value < 1 || value > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
    if (!Number.isInteger(value)) {
      throw new Error('Rating must be an integer');
    }
    this.value = value;
  }

  toStars() {
    return '⭐'.repeat(this.value);
  }

  isGood() {
    return this.value >= 4;
  }
}

module.exports = Rating;