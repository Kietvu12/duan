const User = require('../models/user.model');
const Group = require('../models/group.model');
const UserGroup = require('../models/userGroup.model');
const Transaction = require('../models/transacion.model');
const AuditLog = require('../models/auditlog.model')

class TransactionService {
  static async createTransaction(transactionData, creatorId) {
    const { user_id, group_id } = transactionData;
    
    // Kiểm tra user có trong nhóm không
    const userInGroup = await UserGroup.findOne({
      where: { user_id, group_id }
    });
    
    if (!userInGroup) {
      throw new Error('Người dùng không thuộc nhóm này');
    }

    return await Transaction.create({
      ...transactionData,
      created_by: creatorId
    });
  }

  static async getGroupTransactions(groupId, userId, userRole) {
    const whereCondition = { group_id: groupId };
    
    // Nếu không phải admin, chỉ xem được giao dịch của bản thân
    if (userRole !== 'system_admin' && userRole !== 'group_admin') {
      whereCondition.user_id = userId;
    }

    return await Transaction.findAll({
      where: whereCondition,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['user_id', 'username']
        },
        {
          model: User,
          as: 'relatedUser',
          attributes: ['user_id', 'username']
        }
      ],
      order: [['transaction_date', 'DESC']]
    });
  }
}

module.exports = TransactionService;