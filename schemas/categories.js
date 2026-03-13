const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const Category = sequelize.define('category', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    images: {
        type: DataTypes.JSON, // Array equivalent in MySQL
        defaultValue: ["https://smithcodistributing.com/wp-content/themes/hello-elementor/assets/default_product.png"]
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true
});

module.exports = Category;