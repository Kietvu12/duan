const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserGroup = sequelize.define('UserGroup', {
  user_group_id: {
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
  group_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Groups',
      key: 'group_id'
    }
  },
  is_group_admin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'user_groups',
  timestamps: true,
  createdAt: 'joined_at',
  updatedAt: false
});

module.exports = UserGroup;