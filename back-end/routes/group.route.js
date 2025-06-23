const express = require('express');
const router = express.Router();
const GroupController = require('../controllers/group.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// Get all groups (system_admin only)
router.get('/getList', authenticate, authorize(['system_admin']), GroupController.getAllGroups);

// Get group members and transactions (system_admin or group_admin of the group)
router.get('/:groupId/members-transactions', authenticate, GroupController.getGroupMembersWithTransactions);

module.exports = router;