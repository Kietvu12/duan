const { Sequelize } = require('sequelize');
const config = require('../config/db');

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  logging: false
});

const models = {
  User: require('./user.model')(sequelize, Sequelize.DataTypes),
  Group: require('./group.model')(sequelize, Sequelize.DataTypes),
  UserGroup: require('./user_group.model')(sequelize, Sequelize.DataTypes),
  Transaction: require('./transaction.model')(sequelize, Sequelize.DataTypes),
  AuditLog: require('./auditlog.model')(sequelize, Sequelize.DataTypes)
};

// Thiết lập quan hệ
require('./associations.model').setupAssociations();

module.exports = {
  ...models,
  sequelize
};