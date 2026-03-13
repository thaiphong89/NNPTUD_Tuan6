const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');
const bcrypt = require('bcrypt');
const Role = require('./roles');

const User = sequelize.define('user', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    fullName: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    avatarUrl: {
        type: DataTypes.STRING,
        defaultValue: "https://i.sstatic.net/l60Hf.png"
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Role,
            key: 'id'
        }
    },
    loginCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: { min: 0 }
    },
    lockTime: {
        type: DataTypes.DATE
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true,
    hooks: {
        beforeSave: async (user) => {
            if (user.changed('password')) {
                const salt = bcrypt.genSaltSync(10);
                user.password = bcrypt.hashSync(user.password, salt);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                const salt = bcrypt.genSaltSync(10);
                user.password = bcrypt.hashSync(user.password, salt);
            }
        }
    }
});

Role.hasMany(User, { foreignKey: 'roleId' });
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });

module.exports = User;