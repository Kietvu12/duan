// controllers/reportController.js
const ReportService = require('../reportService');
const schedule = require('node-schedule');

// Hàm tạo báo cáo
const generateReport = async () => {
  try {
    const fileName = await ReportService.generateDailyReport();
    console.log(`Đã tạo báo cáo: ${fileName}`);
  } catch (error) {
    console.error('Lỗi khi tạo báo cáo:', error);
  }
};

// Lập lịch chạy hàng ngày lúc 22:30
schedule.scheduleJob('30 22 * * *', generateReport);

// API để trigger thủ công (nếu cần)
exports.triggerReport = async (req, res) => {
  try {
    const fileName = await ReportService.generateDailyReport();
    res.json({
      success: true,
      message: 'Báo cáo đã được tạo',
      file: fileName
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo báo cáo'
    });
  }
};