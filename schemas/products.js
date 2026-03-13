const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');
const Category = require('./categories');

const Product = sequelize.define('product', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    price: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    description: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Category,
            key: 'id'
        }
    },
    images: {
        type: DataTypes.JSON,
        defaultValue: ["https://smithcodistributing.com/wp-content/themes/hello-elementor/assets/default_product.png"]
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true
});

Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

module.exports = Product;