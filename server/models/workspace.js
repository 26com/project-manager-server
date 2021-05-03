console.log('workspace model');

const { sequelize, Sequelize } = require('./index');

const Workspace = sequelize.define('workspace', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
  },
  background: {
    type: Sequelize.INTEGER,
  },
  createdat: {
    type: Sequelize.DATE,
    allowNull: false,
  },
});

module.exports = {
  Workspace,
};
