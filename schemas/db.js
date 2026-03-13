const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

async function initialize() {
    // Create database if it doesn't exist
    const connection = await mysql.createConnection({ host: 'localhost', user: 'root', password: '' });
    await connection.query('CREATE DATABASE IF NOT EXISTS `nnptud_c6`;');
    await connection.end();
}

const sequelize = new Sequelize('nnptud_c6', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

module.exports = { sequelize, initialize };
