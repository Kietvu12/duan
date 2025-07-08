const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const groupController = require('../controllers/groupController');
const UserGroup = require('../models/UserGroup')
router.post('/', authMiddleware, groupController.createGroup);
router.get('/:id', authMiddleware, groupController.getGroupById);
router.post('/add-user', authMiddleware, groupController.addUserToGroup);
router.post('/remove-user', authMiddleware, groupController.removeUserFromGroup);
router.post('/update-admin', authMiddleware, groupController.updateGroupAdminStatus);
router.get('/', authMiddleware, groupController.getAllGroups);
router.get('/:groupId/members', authMiddleware, async (req, res) => {
  try {
    const { groupId } = req.params;
    if (req.user.role !== 'system_admin') {
      const isInGroup = await UserGroup.isUserInGroup(req.user.userId, groupId);
      if (!isInGroup) {
        return res.status(403).json({ message: 'Bạn không có quyền truy cập nhóm này' });
      }
    }

    // Lấy danh sách thành viên
    const members = await UserGroup.getGroupMembers(groupId);
    
    res.json(members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;
module.exports = router;