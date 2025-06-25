const User = require('./user.model');
const Group = require('./group.model');
const UserGroup = require('./user_group.model');
const Transaction = require('./transaction.model');
const AuditLog = require('./auditlog.model');

// User Associations
User.hasMany(UserGroup, { foreignKey: 'user_id' });
User.hasMany(Group, { foreignKey: 'created_by', as: 'CreatedGroups' });
User.hasMany(Transaction, { foreignKey: 'user_id' });
User.hasMany(Transaction, { foreignKey: 'related_user_id', as: 'RelatedTransactions' });
User.hasMany(Transaction, { foreignKey: 'created_by', as: 'CreatedTransactions' });
User.hasMany(AuditLog, { foreignKey: 'user_id' });

// Group Associations
Group.belongsTo(User, { foreignKey: 'created_by', as: 'Creator' });
Group.hasMany(UserGroup, { foreignKey: 'group_id' });
Group.hasMany(Transaction, { foreignKey: 'group_id' });

// UserGroup Associations
UserGroup.belongsTo(User, { foreignKey: 'user_id' });
UserGroup.belongsTo(Group, { foreignKey: 'group_id' });

// Transaction Associations
Transaction.belongsTo(User, { foreignKey: 'user_id' });
Transaction.belongsTo(Group, { foreignKey: 'group_id' });
Transaction.belongsTo(User, { foreignKey: 'related_user_id', as: 'RelatedUser' });
Transaction.belongsTo(User, { foreignKey: 'created_by', as: 'Creator' });

// AuditLog Associations
AuditLog.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  setupAssociations: () => {
    // Tất cả các quan hệ đã được thiết lập ở trên
  }
};