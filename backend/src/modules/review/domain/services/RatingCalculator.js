class RatingCalculator {
  calculateDistribution(reviews) {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    reviews.forEach(review => {
      distribution[review.rating]++;
    });

    // Convert to percentage
    const total = reviews.length;
    Object.keys(distribution).forEach(rating => {
      distribution[rating] = {
        count: distribution[rating],
        percentage: ((distribution[rating] / total) * 100).toFixed(1)
      };
    });

    return distribution;
  }

  calculateAverage(reviews) {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }
}