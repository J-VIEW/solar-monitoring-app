const PDFDocument = require("pdfkit");
const fs = require("fs");

const generateReport = (reportData, filePath) => {
  const doc = new PDFDocument();

  // Write the PDF to the file
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text("Solar Panel Performance Report", { align: "center" });
  doc.moveDown();

  // Add report data
  reportData.forEach((item) => {
    doc.fontSize(12).text(`Device ID: ${item.device_id}`);
    doc.text(`Current: ${item.current} A`);
    doc.text(`Voltage: ${item.voltage} V`);
    doc.text(`Temperature: ${item.temperature} °C`);
    doc.text(`Dust Level: ${item.dust_level} %`);
    doc.moveDown();
  });

  doc.end();
};

module.exports = generateReport;
