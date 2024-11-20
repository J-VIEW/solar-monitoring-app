const PanelData = require("../models/PanelData");
const PanelMetrics = require("../models/PanelMetrics");
const path = require("path");
const fs = require("fs").promises;

const generateReport = async (data, filePath) => {
  // Implementation of report generation
  // You might want to use a library like pdfkit or html-pdf
  // For now, we'll just create a simple JSON file
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

exports.generatePerformanceReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    // Query data for the report
    const query = { user_id: userId };
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const [panelData, metricsData] = await Promise.all([
      PanelData.find(query).sort({ timestamp: -1 }).limit(10),
      PanelMetrics.find(query).sort({ timestamp: -1 }).limit(10),
    ]);

    // Prepare report data
    const reportData = {
      generatedAt: new Date(),
      panelPerformance: panelData.map((data) => ({
        timestamp: data.timestamp,
        current: data.current,
        voltage: data.voltage,
        temperature: data.temperature,
        dust_level: data.dust_level,
        performance_score: data.performance_score,
      })),
      metrics: metricsData.map((metric) => ({
        timestamp: metric.timestamp,
        current_output: metric.current_output,
        peak_output: metric.peak_output,
        system_efficiency: metric.system_efficiency,
        energy_saved: metric.energy_saved,
      })),
    };

    // Create reports directory if it doesn't exist
    const reportsDir = path.join(__dirname, "../reports");
    await fs.mkdir(reportsDir, { recursive: true });

    const fileName = `performance-report-${Date.now()}.json`;
    const filePath = path.join(reportsDir, fileName);

    // Generate the report
    await generateReport(reportData, filePath);

    // Send file to client
    res.download(filePath, fileName, async (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        // Only send error response if headers haven't been sent yet
        if (!res.headersSent) {
          res.status(500).json({ message: "Error generating report" });
        }
      }

      // Clean up the file after sending
      try {
        await fs.unlink(filePath);
      } catch (unlinkError) {
        console.error("Error cleaning up report file:", unlinkError);
      }
    });
  } catch (err) {
    console.error("Error generating report:", err);
    res.status(500).json({
      message: "Error generating report",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// Get all reports for a user
exports.getUserReports = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const query = { user_id: userId };

    const reports = await PanelData.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await PanelData.countDocuments(query);

    res.status(200).json({
      success: true,
      data: reports,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).json({
      message: "Error fetching reports",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// Delete a report
exports.deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const report = await PanelData.findOne({ _id: id, user_id: userId });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    await report.remove();

    res.status(200).json({
      success: true,
      message: "Report deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting report:", err);
    res.status(500).json({
      message: "Error deleting report",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};
