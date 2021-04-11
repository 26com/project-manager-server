import { Sequelize } from 'sequelize';

import configs from '../config/index.js';
import User from './user.js';

const { db } = configs;

export const sequelize = new Sequelize(
    db.name,
    db.user,
    db.password,
    {
        dialect: 'postgres',
        define: {timestamps: false} 
    }
);

sequelize.sync()
.then(() => {
    console.log(':::DB WAS CONNECTED:::');
})
.catch(err => console.log(err));

