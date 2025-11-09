class GetReviews {
  constructor(reviewRepository) {
    this.reviewRepository = reviewRepository;
  }

  async byService(serviceId, filters = {}) {
    return await this.reviewRepository.findByServiceId(serviceId, filters);
  }

  async byFreelancer(freelancerId, filters = {}) {
    return await this.reviewRepository.findByUserId(freelancerId, filters);
  }

  async latest(limit = 5) {
    const rows = await this.reviewRepository.findByServiceId(null, { limit, page:1, sortBy: 'newest' });
    // if repo doesn't support null serviceId, implement query directly in repo later
    return rows.slice(0, limit);
  }
}

module.exports = GetReviews;
