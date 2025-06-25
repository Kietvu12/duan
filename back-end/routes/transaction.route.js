const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/transaction.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const checkGroupPermission = require('../middlewares/group.middleware');

// Tạo giao dịch
router.post('/',
  authenticate,
  checkGroupPermission('create_transaction'),
  TransactionController.createTransaction
);

// Xem giao dịch nhóm
router.get('/group/:groupId',
  authenticate,
  checkGroupPermission('view_transactions'),
  TransactionController.getGroupTransactions
);

module.exports = router;