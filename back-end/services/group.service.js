const db = require('../config/db');

class GroupService {
  static async getAllGroups() {
    const [groups] = await db.query(`
      SELECT g.group_id, g.group_name, g.created_at, 
             u.user_id as creator_id, u.username as creator_username
      FROM groups g
      JOIN users u ON g.created_by = u.user_id
    `);
    return groups;
  }

  static async getGroupMembersWithTransactions(groupId, userId, userRole) {
    // Kiểm tra group tồn tại
    const [group] = await db.query('SELECT * FROM groups WHERE group_id = ?', [groupId]);
    if (!group || group.length === 0) {
      throw new Error('Group not found');
    }

    // Kiểm tra quyền truy cập
    if (userRole !== 'system_admin') {
      const [userGroup] = await db.query(
        'SELECT 1 FROM user_groups WHERE user_id = ? AND group_id = ? AND is_group_admin = 1',
        [userId, groupId]
      );
      if (!userGroup || userGroup.length === 0) {
        throw new Error('Unauthorized access to group');
      }
    }

    // Lấy thành viên
    const [members] = await db.query(`
      SELECT u.user_id, u.username, u.zalo_name, u.email, u.role, u.points, u.balance,
             ug.is_group_admin, ug.joined_at
      FROM users u
      JOIN user_groups ug ON u.user_id = ug.user_id
      WHERE ug.group_id = ?
      ORDER BY ug.is_group_admin DESC, u.username ASC
    `, [groupId]);

    // Lấy giao dịch
    const [transactions] = await db.query(`
      SELECT t.transaction_id, t.user_id, t.transaction_date, t.points_change,
             t.transaction_type, t.related_user_id, t.amount, t.content,
             u.username as related_username,
             creator.username as created_by_username
      FROM transactions t
      LEFT JOIN users u ON t.related_user_id = u.user_id
      JOIN users creator ON t.created_by = creator.user_id
      WHERE t.group_id = ?
      ORDER BY t.transaction_date DESC
    `, [groupId]);

    return {
      group: group[0],
      members,
      transactions
    };
  }
}

module.exports = GroupService;