const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const userController = require('../controllers/userController');

router.get('/', authMiddleware, roleMiddleware('system_admin'), userController.getAllUsers);
router.get('/:id', authMiddleware, userController.getUserById);
router.post('/', authMiddleware, roleMiddleware('system_admin'), userController.createUser);
router.put('/:id', authMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, roleMiddleware('system_admin'), userController.deleteUser);

module.exports = router;