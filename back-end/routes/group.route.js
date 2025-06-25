const express = require('express');
const router = express.Router();
const GroupController = require('../controllers/group.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const checkGroupPermission = require('../middlewares/group.middleware');

// Tạo nhóm - chỉ system_admin
router.post('/', 
  authenticate, 
  authorize(['system_admin']), 
  GroupController.createGroup
);

router.post('/:groupId/members',
  authenticate,
  checkGroupPermission('manage_members'),
  GroupController.addMember
);

router.get('/:groupId',
  authenticate,
  checkGroupPermission('view_transactions'),
  GroupController.getGroupDetails
);

module.exports = router;