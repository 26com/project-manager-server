console.log('project model');

const { sequelize, Sequelize } = require('./index');

const Project = sequelize.define('project', {
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
  background: {
    type: Sequelize.INTEGER,
  },
  createdat: {
    type: Sequelize.DATE,
    allowNull: false,
  },
});

module.exports = {
  Project,
};
