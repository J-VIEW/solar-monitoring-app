// backend/controllers/metricsController.js
exports.getDashboardMetrics = async (req, res) => {
  try {
    const userId = req.user.id;
    const metrics = await PanelMetrics.findOne({ user_id: userId })
      .sort({ timestamp: -1 })
      .lean();

    if (!metrics) {
      return res.status(200).json({
        success: true,
        data: {
          current_output: 0,
          peak_output: 0,
          system_efficiency: 0,
          temperature: 0,
          energy_saved: 0,
          hourly_output: [],
          daily_production: [],
          energy_distribution: [],
        },
      });
    }

    // Process metrics data
    const processedMetrics = {
      ...metrics,
      hourly_output: metrics.hourly_output || [],
      daily_production: metrics.daily_production || [],
      energy_distribution: metrics.energy_distribution || [],
    };

    res.status(200).json({
      success: true,
      data: processedMetrics,
    });
  } catch (error) {
    console.error("Metrics fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching metrics data",
    });
  }
};
