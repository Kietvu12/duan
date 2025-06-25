const express = require('express');
const router = express.Router();
const GroupController = require('../controllers/group.controller');
const { authenticate } = require('../middlewares/auth.middleware');

// Lấy danh sách nhóm (system_admin only)
router.get('/list', authenticate, GroupController.getAllGroups);

// Lấy thành viên và giao dịch trong nhóm (system_admin hoặc group_admin của nhóm đó)
router.get('/:groupId/members-transactions', authenticate, GroupController.getGroupMembersWithTransactions);

module.exports = router;