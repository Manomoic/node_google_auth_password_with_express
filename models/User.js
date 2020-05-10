'use strict';

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const Sequelize = require("sequelize");
const db = require('../config/database');
const uuid = require("uuid");

const User = db.define('oauth_user_profile',
{
    id: {
        primaryKey: true,
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4
    },
    google_user_id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    google_fullName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    avatar: {
        type: Sequelize.STRING,
        allowNull: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    isEmailVerified: {
        type: Sequelize.ENUM('true', 'false')
    },
    accessToken: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    loggedinAt: {
        allowNull: false,
        type: Sequelize.DATE
    }
});

User.beforeCreate(userModel => userModel.id = uuid.v4() );

/**
 * To create a table without using PHPMyAdmin, benchworker etc.. 
 * Change force: false to true - the table will be created automatically
 * If you wish to alter the table anyhow, just uncomment the Alter line, then save
*/

User.sync({ force: false/*, alter: true*/ })
.then(/*(output) => { console.log({ message: output }) }*/)
.catch((error) => console.log(`Error Creating Or Altering Table AT ${error}`) );

module.exports = User;