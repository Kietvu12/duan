const db = require('../config/db');

class Group {
  static async create({ group_name, created_by }) {
    const [result] = await db.query(
      'INSERT INTO groups (group_name, created_at, created_by) VALUES (?, NOW(), ?)',
      [group_name, created_by]
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM groups WHERE group_id = ?', [id]);
    return rows[0];
  }

  static async getAll() {
    const [rows] = await db.query('SELECT * FROM groups');
    return rows;
  }

  static async delete(id) {
    await db.query('DELETE FROM groups WHERE group_id = ?', [id]);
  }
}

module.exports = Group;