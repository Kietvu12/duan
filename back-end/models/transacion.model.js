const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Transaction = sequelize.define('Transaction', {
  transaction_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  group_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'groups',
      key: 'group_id'
    }
  },
  transaction_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  points_change: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  transaction_type: {
    type: DataTypes.ENUM('nhan_san','san_cho','nhan_lich','giao_lich'),
    allowNull: false
  },
  related_user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id'
    }
  }
}, {
  tableName: 'transactions',
  timestamps: false
});

module.exports = Transaction;