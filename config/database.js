'use strict';

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const Sequelize = require("sequelize");

const db = new Sequelize(process.env.DBNAME, process.env.DBUSER, process.env.DBPASS, {
    host: process.env.DBHOST,
    dialect: "mysql",
    define: {
        charset: "utf8",
        dialectOptions: {
            collate: "utf8_general_ci"
        }
    },

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

module.exports = db;