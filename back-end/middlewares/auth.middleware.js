const { verifyToken } = require('../config/jwt');
const db = require('../config/db');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Token không được cung cấp' });
    }

    const decoded = verifyToken(token);
    
    // Kiểm tra user có tồn tại trong DB không
    const [users] = await db.query('SELECT * FROM users WHERE user_id = ?', [decoded.user_id]);
    if (!users || users.length === 0) {
      return res.status(401).json({ error: 'Người dùng không tồn tại' });
    }

    // Gán thông tin user vào request
    req.user = users[0];
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Xác thực thất bại' });
  }
};

const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Không có quyền truy cập' });
    }
    next();
  };
};

module.exports = {
  authenticate,
  authorize
};