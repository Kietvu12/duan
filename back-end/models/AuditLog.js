const db = require('../config/db');

class AuditLog {
  static async create({
    user_id,
    action,
    table_affected,
    record_id = null,
    old_values = null,
    new_values = null
  }) {
    await db.query(
      `INSERT INTO audit_logs 
      (user_id, action, table_affected, record_id, old_values, new_values) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, action, table_affected, record_id, old_values, new_values]
    );
  }

  static async getLogs() {
    const [rows] = await db.query(
      'SELECT al.*, u.username FROM audit_logs al JOIN users u ON al.user_id = u.user_id ORDER BY action_time DESC'
    );
    return rows;
  }
}

module.exports = AuditLog;