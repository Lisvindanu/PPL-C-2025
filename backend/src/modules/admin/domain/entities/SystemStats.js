class SystemStats {
  constructor(data) {
    this.totalUsers = data.totalUsers || 0;
    this.totalFreelancers = data.totalFreelancers || 0;
    this.totalClients = data.totalClients || 0;
    this.totalOrders = data.totalOrders || 0;
    this.completedOrders = data.completedOrders || 0;
    this.totalRevenue = data.totalRevenue || 0;
    this.platformFees = data.platformFees || 0;
    this.timestamp = data.timestamp || new Date();
  }
}