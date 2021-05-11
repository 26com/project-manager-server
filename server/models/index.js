const { Sequelize } = require('sequelize');

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
};

const { User } = require('./user');
const { Workspace } = require('./workspace');
const { Project } = require('./project');

User.hasMany(Workspace, { onDelete: 'cascade' });
Workspace.belongsTo(User);

Workspace.hasMany(Project, { onDelete: 'cascade' });
Project.belongsTo(Workspace);

User.belongsToMany(Project, { through: 'UserProjects' });
Project.belongsToMany(User, { through: 'UserProjects' });

sequelize.sync()
  .then(() => {
    console.log(':::DB WAS CONNECTED:::');
  })
  .catch((err) => console.log(err));
