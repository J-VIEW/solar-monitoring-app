function processChartData(data) {
  return data.map((item) => ({
    timestamp: item.timestamp,
    value: item.value,
  }));
}

module.exports = { processChartData };
