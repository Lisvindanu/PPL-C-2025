class ChartService {
  static formatForChart(data, type = 'line') {
    if (!Array.isArray(data) || data.length === 0) {
      return {
        type,
        labels: [],
        datasets: []
      };
    }

    const labels = data.map(item => item.month || item.status || item.count);
    const values = data.map(item => item.count || item.amount || 0);

    return {
      type,
      labels,
      datasets: [
        {
          label: type === 'line' ? 'Trend' : 'Data',
          data: values,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          fill: true
        }
      ]
    };
  }
}

module.exports = ChartService;