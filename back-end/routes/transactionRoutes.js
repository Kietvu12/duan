const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const transactionController = require('../controllers/transactionController');

router.post('/', authMiddleware, transactionController.createTransaction);
router.get('/user/:userId', authMiddleware, transactionController.getTransactionsByUser);
router.get('/group/:groupId', authMiddleware, transactionController.getTransactionsByGroup);

module.exports = router;