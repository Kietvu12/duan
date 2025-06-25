const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// Lấy tất cả user - Chỉ system_admin
router.get('/', 
  authenticate,
  authorize(['system_admin']),
  UserController.getAllUsers
);

// Cập nhật thông tin user
router.put('/:id',
  authenticate,
  UserController.updateUser
);

// Xóa user - Chỉ system_admin
router.delete('/:id',
  authenticate,
  authorize(['system_admin']),
  UserController.deleteUser
);

module.exports = router;