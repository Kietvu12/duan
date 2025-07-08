// routes/reportRoutes.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const db = require('../config/db');
const router = express.Router();

// Thư mục lưu report
const REPORTS_DIR = path.join(__dirname, '../reports');

// Đảm bảo thư mục tồn tại
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR);
}

// Generate report mới
router.post('/generate', async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Báo cáo');
    
    // Tạo header
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Tên nhóm', key: 'group_name', width: 25 },
      { header: 'Số thành viên', key: 'member_count', width: 15 },
      { header: 'Người tạo', key: 'creator', width: 20 },
      { header: 'Ngày tạo', key: 'created_at', width: 20 }
    ];

    // Lấy dữ liệu từ database
    const [groups] = await db.query(`
      SELECT g.*, u.zalo_name as creator, 
      COUNT(ug.user_id) as member_count
      FROM groups g
      LEFT JOIN user_groups ug ON g.group_id = ug.group_id
      LEFT JOIN users u ON g.created_by = u.user_id
      GROUP BY g.group_id
    `);

    // Thêm dữ liệu vào Excel
    groups.forEach(group => {
      worksheet.addRow({
        id: group.group_id,
        group_name: group.group_name,
        member_count: group.member_count,
        creator: group.creator,
        created_at: new Date(group.created_at).toLocaleString()
      });
    });

    // Tạo tên file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `report-${timestamp}.xlsx`;
    const filepath = path.join(REPORTS_DIR, filename);

    // Lưu file
    await workbook.xlsx.writeFile(filepath);
    
    res.json({ 
      success: true,
      filename,
      path: filepath
    });
  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Lỗi khi tạo báo cáo' 
    });
  }
});

// Lấy danh sách file report (như trước)
router.get('/', (req, res) => {
  fs.readdir(REPORTS_DIR, (err, files) => {
    if (err) return res.status(500).json({ error: 'Không thể đọc thư mục reports' });
    
    const reportFiles = files
      .filter(file => file.endsWith('.xlsx'))
      .map(file => ({
        name: file,
        path: path.join(REPORTS_DIR, file),
        date: fs.statSync(path.join(REPORTS_DIR, file)).mtime
      }))
      .sort((a, b) => b.date - a.date);

    res.json({ files: reportFiles });
  });
});

// Download file
router.get('/download/:filename', (req, res) => {
  const filepath = path.join(REPORTS_DIR, req.params.filename);
  
  if (fs.existsSync(filepath)) {
    res.download(filepath);
  } else {
    res.status(404).json({ error: 'File không tồn tại' });
  }
});

module.exports = router;