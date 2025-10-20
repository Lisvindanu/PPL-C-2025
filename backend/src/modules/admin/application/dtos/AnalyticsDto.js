class AnalyticsDto {
  static toResponse(data) {
    return {
      labels: data.map(d => d.date),
      datasets: {
        orders: data.map(d => d.orders),
        revenue: data.map(d => d.revenue),
        users: data.map(d => d.users),
      },
    };
  }
}