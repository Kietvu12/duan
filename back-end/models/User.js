const db = require('../config/db');

class User {
  static async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM users WHERE user_id = ?', [id]);
    return rows[0];
  }

  static async create({ username, zalo_name, email, password_hash, role = 'user' }) {
    const [result] = await db.query(
      'INSERT INTO users (username, zalo_name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [username, zalo_name, email, password_hash, role]
    );
    return result.insertId;
  }

  static async update(id, updates) {
    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(id);
    
    await db.query(`UPDATE users SET ${setClause} WHERE user_id = ?`, values);
  }

  static async delete(id) {
    await db.query('DELETE FROM users WHERE user_id = ?', [id]);
  }

  static async getAll() {
    const [rows] = await db.query('SELECT * FROM users WHERE is_active = 1');
    return rows;
  }

  static async updatePointsAndBalance(userId, pointsChange, balanceChange) {
    await db.query(
      'UPDATE users SET points = points + ?, balance = balance + ? WHERE user_id = ?',
      [pointsChange, balanceChange, userId]
    );
  }
}

module.exports = User;