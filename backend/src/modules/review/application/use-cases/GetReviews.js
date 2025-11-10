class GetReviews {
  constructor(reviewRepository) {
    this.reviewRepository = reviewRepository;
  }

  async byService(serviceId, filters = {}) {
    const reviews = await this.reviewRepository.findByServiceId(
      serviceId,
      filters
    );
    const total = await this.reviewRepository.countByServiceId(
      serviceId,
      filters
    );

    return { reviews, total };
  }

  async byFreelancer(freelancerId, filters = {}) {
    const reviews = await this.reviewRepository.findByFreelancerId(
      freelancerId,
      filters
    );
    const total = await this.reviewRepository.countByFreelancerId(
      freelancerId,
      filters
    );

    return { reviews, total };
  }

  async byUser(userId, filters = {}) {
    return await this.reviewRepository.findByUserId(userId, filters);
  }

  async latest(limit = 5) {
    return await this.reviewRepository.findLatest(limit);
  }

  async byId(id) {
    return await this.reviewRepository.findById(id);
  }
}

module.exports = GetReviews;
