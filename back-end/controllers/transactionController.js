const Transaction = require('../models/Transaction');
const UserGroup = require('../models/UserGroup');
const AuditLog = require('../models/AuditLog');

const createTransaction = async (req, res) => {
  try {
    const {
      user_id,
      group_id,
      transaction_date,
      points_change,
      transaction_type,
      related_user,
      amount,
      content
    } = req.body;

    // Validate transaction type
    const validTypes = ['nhan_san', 'san_cho', 'nhan_lich', 'giao_lich'];
    if (!validTypes.includes(transaction_type)) {
      return res.status(400).json({ message: 'Invalid transaction type' });
    }

    // Check if user is in the group
    const isUserInGroup = await UserGroup.isUserInGroup(user_id, group_id);
    if (!isUserInGroup) {
      return res.status(400).json({ message: 'User is not in the specified group' });
    }

    // Check permissions
    const isRequesterInGroup = await UserGroup.isUserInGroup(req.user.userId, group_id);
    const isRequesterGroupAdmin = await UserGroup.isGroupAdmin(req.user.userId, group_id);
    
    // Only allow if:
    // 1. System admin
    // 2. Group admin for this group
    // 3. Regular user creating transaction for themselves
    if (req.user.role !== 'system_admin' && 
        !isRequesterGroupAdmin && 
        (req.user.userId !== user_id || !isRequesterInGroup)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const transactionId = await Transaction.create({
      user_id,
      group_id,
      transaction_date: transaction_date || new Date(),
      points_change,
      transaction_type,
      related_user,
      amount,
      content,
      created_by: req.user.userId
    });

    await AuditLog.create({
      user_id: req.user.userId,
      action: 'create',
      table_affected: 'transactions',
      record_id: transactionId,
      new_values: JSON.stringify({
        user_id, group_id, points_change, transaction_type, amount
      })
    });

    res.status(201).json({ message: 'Transaction created successfully', transactionId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getTransactionsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const groupId = req.query.groupId || null;

    // Only allow if:
    // 1. System admin
    // 2. Group admin for this group
    // 3. Regular user viewing their own transactions
    if (req.user.role !== 'system_admin' && 
        req.user.userId !== parseInt(userId)) {
      
      if (groupId) {
        const isGroupAdmin = await UserGroup.isGroupAdmin(req.user.userId, groupId);
        if (!isGroupAdmin) {
          return res.status(403).json({ message: 'Unauthorized' });
        }
      }
    }

    const transactions = await Transaction.getByUserId(userId, groupId);
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getTransactionsByGroup = async (req, res) => {
  try {
    const groupId = req.params.groupId;

    // Check if user is in the group or is system admin
    const isInGroup = await UserGroup.isUserInGroup(req.user.userId, groupId);
    const isGroupAdmin = await UserGroup.isGroupAdmin(req.user.userId, groupId);
    
    if (req.user.role !== 'system_admin' && !isInGroup) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Regular users can only see their own transactions in the group
    if (req.user.role !== 'system_admin' && !isGroupAdmin) {
      const transactions = await Transaction.getByUserId(req.user.userId, groupId);
      return res.json(transactions);
    }

    // Group admins and system admins can see all transactions in the group
    const transactions = await Transaction.getByGroupId(groupId);
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createTransaction,
  getTransactionsByUser,
  getTransactionsByGroup
};