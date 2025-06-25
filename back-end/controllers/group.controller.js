const db = require('../config/db');
const User = require('../models/user.model');
const Group = require('../models/group.model');
const UserGroup = require('../models/user_group.model');
const Transaction = require('../models/transaction.model');
class GroupController {
  static async getAllGroups(req, res) {
    try {
      if (req.user.role !== 'system_admin') {
        return res.status(403).json({ error: 'Forbidden: Only system administrators can access this resource' });
      }

      const [groups] = await db.query(`
        SELECT g.group_id, g.group_name, g.created_at, 
               u.user_id as creator_id, u.username as creator_username
        FROM groups g
        JOIN users u ON g.created_by = u.user_id
      `);
      
      res.json(groups);
    } catch (error) {
      console.error('Error getting groups:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
static async getGroupMembersWithTransactions(req, res) {
  try {
    const { groupId } = req.params;
    const userId = req.user.user_id;
    const userRole = req.user.role;
    console.log("Controller groupId:", groupId);

    // 1. Kiểm tra nhóm tồn tại - dùng Sequelize model
    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Nhóm không tồn tại' });
    }

    // 2. Kiểm tra quyền truy cập
    if (userRole !== 'system_admin') {
      const userGroup = await UserGroup.findOne({
        where: {
          user_id: userId,
          group_id: groupId,
          is_group_admin: true
        }
      });
      
      if (!userGroup) {
        return res.status(403).json({ error: 'Không có quyền truy cập nhóm này' });
      }
    }

    // 3. Lấy danh sách thành viên
    const members = await User.findAll({
      include: [{
        model: UserGroup,
        where: { group_id: groupId },
        attributes: ['is_group_admin', 'joined_at']
      }],
      order: [
        [UserGroup, 'is_group_admin', 'DESC'], // Sắp xếp admin trước
        ['username', 'ASC'] // Sắp xếp theo tên
      ]
    });

    // 4. Lấy giao dịch
    const transactions = await Transaction.findAll({
      where: { group_id: groupId },
      include: [
        {
          model: User,
          as: 'relatedUser',
          attributes: ['username']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['username']
        }
      ],
      order: [['transaction_date', 'DESC']] // Sắp xếp mới nhất trước
    });

    return res.json({
      group,
      members,
      transactions
    });

  } catch (error) {
    console.error('Lỗi khi lấy thông tin nhóm:', error);
    return res.status(500).json({ 
      error: 'Lỗi server',
      details: error.message 
    });
  }
}
}

module.exports = GroupController;