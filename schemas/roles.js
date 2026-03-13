const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const Role = sequelize.define('role', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true
});

module.exports = Role;