const { Sequelize, DataTypes } = require('sequelize');

const { configs } = require('../config/index');

const { db } = configs;

const sequelize = new Sequelize(
  db.name,
  db.user,
  db.password,
  {
    dialect: 'postgres',
    define: { timestamps: false },
  },
);

module.exports = {
  sequelize,
  Sequelize,
  DataTypes,
};

const { User } = require('./user');
const { Workspace } = require('./workspace');

console.log(User);
console.log(Workspace);

User.hasMany(Workspace, { onDelete: 'cascade' });
Workspace.belongsTo(User);

sequelize.sync()
  .then(() => {
    console.log(':::DB WAS CONNECTED:::');
  })
  .catch((err) => console.log(err));
