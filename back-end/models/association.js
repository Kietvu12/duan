const { sequelize } = require('../config/db');
const User = require('./user.model');
const Group = require('./group.model');
const UserGroup = require('./userGroup.model');
const Transaction = require('./transacion.model')
const AuditLog = require('./auditLog.model');

function setupAssociations() {
  // Quan hệ Many-to-Many
  User.belongsToMany(Group, {
    through: UserGroup,
    foreignKey: 'user_id',
    otherKey: 'group_id',
    as: 'groups'
  });

  Group.belongsToMany(User, {
    through: UserGroup,
    foreignKey: 'group_id',
    otherKey: 'user_id',
    as: 'members'
  });

  // Quan hệ 1-N
  User.hasMany(UserGroup, { 
    foreignKey: 'user_id',
    as: 'userGroupRelations'
  });

  Group.hasMany(UserGroup, { 
    foreignKey: 'group_id',
    as: 'userGroupRelations'
  });

  // Quan hệ Transaction
  User.hasMany(Transaction, { 
    foreignKey: 'user_id',
    as: 'initiatedTransactions'
  });
  
  User.hasMany(Transaction, { 
    foreignKey: 'related_user_id',
    as: 'relatedTransactions'
  });
  
  User.hasMany(Transaction, { 
    foreignKey: 'created_by',
    as: 'createdTransactions'
  });

  Group.hasMany(Transaction, { 
    foreignKey: 'group_id',
    as: 'transactions'
  });

  // Quan hệ AuditLog
  User.hasMany(AuditLog, { 
    foreignKey: 'user_id',
    as: 'auditLogs'
  });

  // Quan hệ ngược
  Transaction.belongsTo(User, { 
    foreignKey: 'user_id',
    as: 'user'
  });
  
  Transaction.belongsTo(User, { 
    foreignKey: 'related_user_id',
    as: 'relatedUser'
  });
  
  Transaction.belongsTo(User, { 
    foreignKey: 'created_by',
    as: 'creator'
  });

  Transaction.belongsTo(Group, { 
    foreignKey: 'group_id',
    as: 'group'
  });

  Group.belongsTo(User, { 
    foreignKey: 'created_by',
    as: 'creator'
  });

  console.log('✅ Đã thiết lập xong quan hệ giữa các model');
}

module.exports = setupAssociations;