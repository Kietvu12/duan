const ExcelJS = require('exceljs');
const db = require('./config/db');
const { format } = require('date-fns');

class ReportService {
  static async generateDailyReport() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Báo cáo ngày');
    
    // Lấy ngày hiện tại
    const reportDate = format(new Date(), 'yyyy-MM-dd');
    const fileName = `daily_report_${reportDate}.xlsx`;
    
    // Tạo header
    worksheet.columns = [
      { header: 'STT', key: 'id', width: 5 },
      { header: 'Tên nhóm', key: 'group_name', width: 25 },
      { header: 'Số giao dịch', key: 'transaction_count', width: 15 },
      { header: 'Tổng điểm', key: 'total_points', width: 15 },
      { header: 'Tổng tiền', key: 'total_amount', width: 20 },
      { header: 'Người tạo', key: 'creator', width: 25 },
      { header: 'Ngày tạo', key: 'created_at', width: 20 }
    ];
    
    // Lấy dữ liệu từ database
    const [groups] = await db.query(`
      SELECT 
        g.group_id,
        g.group_name,
        g.created_at,
        u.zalo_name as creator,
        COUNT(t.transaction_id) as transaction_count,
        SUM(t.points_change) as total_points,
        SUM(t.amount) as total_amount
      FROM groups g
      LEFT JOIN transactions t ON g.group_id = t.group_id
      LEFT JOIN users u ON g.created_by = u.user_id
      WHERE DATE(g.created_at) = CURDATE()
      GROUP BY g.group_id
    `);
    
    // Thêm dữ liệu vào file Excel
    groups.forEach((group, index) => {
      worksheet.addRow({
        id: index + 1,
        group_name: group.group_name,
        transaction_count: group.transaction_count || 0,
        total_points: group.total_points || 0,
        total_amount: group.total_amount || 0,
        creator: group.creator,
        created_at: format(new Date(group.created_at), 'yyyy-MM-dd HH:mm:ss')
      });
    });
    
    // Lưu file
    await workbook.xlsx.writeFile(`./reports/${fileName}`);
    return fileName;
  }
}

module.exports = ReportService;