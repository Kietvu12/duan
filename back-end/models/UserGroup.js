const db = require('../config/db');

class UserGroup {
  static async addUserToGroup(userId, groupId, isGroupAdmin = false) {
    const [result] = await db.query(
      'INSERT INTO user_groups (user_id, group_id, is_group_admin, joined_at) VALUES (?, ?, ?, NOW())',
      [userId, groupId, isGroupAdmin]
    );
    return result.insertId;
  }

  static async removeUserFromGroup(userId, groupId) {
    await db.query('DELETE FROM user_groups WHERE user_id = ? AND group_id = ?', [userId, groupId]);
  }

  static async getUserGroups(userId) {
    const [rows] = await db.query(
      'SELECT g.*, ug.is_group_admin FROM user_groups ug JOIN groups g ON ug.group_id = g.group_id WHERE ug.user_id = ?',
      [userId]
    );
    return rows;
  }

  static async getGroupMembers(groupId) {
    const [rows] = await db.query(
      'SELECT u.*, ug.is_group_admin FROM user_groups ug JOIN users u ON ug.user_id = u.user_id WHERE ug.group_id = ? AND u.is_active = 1',
      [groupId]
    );
    return rows;
  }
static async getGroupsByAdmin(userId) {
  // Lấy tất cả group_id mà user là admin
  const [groupRows] = await db.query(
    `SELECT group_id FROM user_groups 
     WHERE user_id = ? AND is_group_admin = 1`,
    [userId]
  );
  
  // Nếu không có nhóm nào
  if (!groupRows.length) return [];
  
  // Lấy danh sách các group_id
  const groupIds = groupRows.map(row => row.group_id);
  
  // Lấy thông tin đầy đủ của các nhóm
  const [groups] = await db.query(
    `SELECT * FROM groups WHERE group_id IN (?)`,
    [groupIds]
  );
  
  return groups;
}
  static async updateAdminStatus(userId, groupId, isGroupAdmin) {
    await db.query(
      'UPDATE user_groups SET is_group_admin = ? WHERE user_id = ? AND group_id = ?',
      [isGroupAdmin, userId, groupId]
    );
  }

  static async isUserInGroup(userId, groupId) {
    const [rows] = await db.query(
      'SELECT 1 FROM user_groups WHERE user_id = ? AND group_id = ?',
      [userId, groupId]
    );
    return rows.length > 0;
  }

  static async isGroupAdmin(userId, groupId) {
    const [rows] = await db.query(
      'SELECT is_group_admin FROM user_groups WHERE user_id = ? AND group_id = ?',
      [userId, groupId]
    );
    return rows.length > 0 && rows[0].is_group_admin === 1;
  }
}

module.exports = UserGroup;