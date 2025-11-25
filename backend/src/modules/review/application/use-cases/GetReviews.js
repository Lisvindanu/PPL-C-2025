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

    const reviews = await this.reviewRepository.findByUserId(
      userId,
      filters
    );
    const total = await this.reviewRepository.countByUserId(
      userId,
      filters
    );

    return { reviews, total };
  }

  async latest(limit = 5) {
    return await this.reviewRepository.findLatest(limit);
  }

  async byId(id) {
    return await this.reviewRepository.findById(id);
  }
}

module.exports = GetReviews;
