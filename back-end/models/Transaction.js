const db = require('../config/db');
const User = require('./User');

class Transaction {
  static async create({
    user_id,
    group_id,
    transaction_date,
    points_change,
    transaction_type,
    related_user_id,
    amount,
    content,
    created_by
  }) {
    const [result] = await db.query(
      `INSERT INTO transactions 
      (user_id, group_id, transaction_date, points_change, transaction_type, related_user_id, amount, content, created_by) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, group_id, transaction_date, points_change, transaction_type, related_user_id, amount, content, created_by]
    );

    // Update user's points and balance based on transaction type
    let balanceChange = amount;
    if (transaction_type === 'nhan_san' || transaction_type === 'san_cho') {
      balanceChange = -amount;
      points_change = -points_change;
    }

    await User.updatePointsAndBalance(user_id, points_change, balanceChange);

    return result.insertId;
  }

  static async getByUserId(userId, groupId = null) {
    let query = 'SELECT * FROM transactions WHERE user_id = ?';
    const params = [userId];
    
    if (groupId) {
      query += ' AND group_id = ?';
      params.push(groupId);
    }
    
    query += ' ORDER BY transaction_date DESC';
    
    const [rows] = await db.query(query, params);
    return rows;
  }

  static async getByGroupId(groupId) {
    const [rows] = await db.query(
      'SELECT * FROM transactions WHERE group_id = ? ORDER BY transaction_date DESC',
      [groupId]
    );
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM transactions WHERE transaction_id = ?', [id]);
    return rows[0];
  }
}

module.exports = Transaction;