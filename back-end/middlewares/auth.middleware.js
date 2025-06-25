const { verifyToken } = require('../config/jwt');
const db = require('../config/db');
const User = require('../models/user.model');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log(token);
    
    if (!token) {
      return res.status(401).json({ error: 'Token không được cung cấp' });
    }
    const decoded = verifyToken(token);
    console.log(decoded);
    
    // Sử dụng Sequelize model thay vì raw query
    const user = await User.findByPk(decoded.user_id, {
      attributes: { exclude: ['password_hash'] }
    });
    console.log(user);
    
    
    if (!user) {
      return res.status(401).json({ error: 'Người dùng không tồn tại' });
    }

    req.user = user.get({ plain: true });
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