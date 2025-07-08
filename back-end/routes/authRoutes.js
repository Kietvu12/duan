const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.getCurrentUser);
router.post('/logout', (req, res) => {
  try {
    // Nếu dùng JWT trong cookie
    res.clearCookie('token');
    
    // Hoặc nếu dùng JWT trong header
    // Không cần làm gì thêm vì client sẽ tự xóa token
    
    res.json({ success: true, message: 'Đăng xuất thành công' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi đăng xuất' });
  }
});
router.post('/register', async (req, res) => {
  try {
    const { username, zalo_name, email, password, points = 0, balance = 0 } = req.body;
    
    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const userId = await User.create({
      username,
      zalo_name,
      email,
      password_hash: hashedPassword,
      role: 'user', // Mặc định là user
      points,
      balance
    });

    res.status(201).json({ 
      success: true,
      message: 'Đăng ký thành công',
      userId
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi hệ thống' 
    });
  }
});

module.exports = router;