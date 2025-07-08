const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { jwtSecret, jwtExpiration } = require('../config/jwt');
const User = require('../models/User');
const UserGroup = require('../models/UserGroup'); // Add this import
const AuditLog = require('../models/AuditLog');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.user_id, role: user.role },
      jwtSecret,
      { expiresIn: jwtExpiration }
    );

    await AuditLog.create({
      user_id: user.user_id,
      action: 'login',
      table_affected: 'users',
      record_id: user.user_id
    });

    res.json({ 
      token, 
      user: { 
        id: user.user_id, 
        username: user.username, 
        role: user.role 
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error during login',
      error: error.message 
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    // Add validation for req.user
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Unauthorized - invalid user data' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user groups
    const userGroups = await UserGroup.getUserGroups(user.user_id);

    res.json({
      id: user.user_id,
      zaloName: user.zalo_name,
      email: user.email,
      role: user.role,
      points: user.points,
      balance: user.balance,
      groups: userGroups
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ 
      message: 'Server error while fetching user data',
      error: error.message 
    });
  }
};

module.exports = { login, getCurrentUser };