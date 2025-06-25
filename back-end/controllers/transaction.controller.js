const TransactionService = require('../services/transaction.service');

class TransactionController {
  static async createTransaction(req, res) {
    try {
      const transaction = await TransactionService.createTransaction(
        req.body,
        req.user.user_id
      );
      res.status(201).json(transaction);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getGroupTransactions(req, res) {
    try {
      const { groupId } = req.params;
      const transactions = await TransactionService.getGroupTransactions(
        groupId,
        req.user.user_id,
        req.user.role
      );
      res.json(transactions);
    } catch (error) {
      res.status(403).json({ error: error.message });
    }
  }
}

module.exports = TransactionController;