const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const AuditLog = sequelize.define('AuditLog', {
  log_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'user_id'
    }
  },
  action: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  table_affected: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  record_id: {
    type: DataTypes.INTEGER
  },
  old_values: {
    type: DataTypes.TEXT
  },
  new_values: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'audit_logs',
  timestamps: true,
  createdAt: 'action_time',
  updatedAt: false
});

module.exports = AuditLog;