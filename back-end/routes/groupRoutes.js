const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const groupController = require('../controllers/groupController');

router.post('/', authMiddleware, groupController.createGroup);
router.get('/:id', authMiddleware, groupController.getGroupById);
router.post('/add-user', authMiddleware, groupController.addUserToGroup);
router.post('/remove-user', authMiddleware, groupController.removeUserFromGroup);
router.post('/update-admin', authMiddleware, groupController.updateGroupAdminStatus);
router.get('/', authMiddleware, groupController.getAllGroups);
module.exports = router;