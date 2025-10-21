class StatsDto {
  static toResponse(stats) {
    return {
      totalUsers: stats.totalUsers,
      totalFreelancers: stats.totalFreelancers,
      totalClients: stats.totalClients,
      totalOrders: stats.totalOrders,
      completedOrders: stats.completedOrders,
      completionRate: stats.totalOrders > 0 
        ? `${((stats.completedOrders / stats.totalOrders) * 100).toFixed(2)}%`
        : '0%',
      totalRevenue: stats.totalRevenue,
      platformFees: stats.platformFees,
      timestamp: new Date()
    };
  }
}

module.exports = StatsDto;