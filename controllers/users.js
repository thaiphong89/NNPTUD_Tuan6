let userModel = require('../schemas/users');
let roleModel = require('../schemas/roles');

module.exports = {
    CreateAnUser: function (username, password,
        email, role, fullname, avatar, status, logincount) {
        return userModel.build(
            {
                username: username,
                password: password,
                email: email,
                fullName: fullname,
                avatarUrl: avatar,
                status: status,
                roleId: role,
                loginCount: logincount
            }
        )
    },
    FindByUsername: async function (username) {
        return await userModel.findOne({
            where: {
                username: username,
                isDeleted: false
            }
        })
    },
    FailLogin: async function (user) {
        user.loginCount++;
        if (user.loginCount == 3) {
            user.loginCount = 0;
            user.lockTime = new Date(Date.now() + 60 * 60 * 1000)
        }
        await user.save()
    },
    SuccessLogin: async function (user) {
        user.loginCount = 0;
        await user.save()
    },
    GetAllUser: async function () {
        return await userModel
            .findAll({
                where: { isDeleted: false },
                include: [{
                    model: roleModel,
                    as: 'role',
                    attributes: ['name']
                }]
            })
    },
    FindById: async function (id) {
        try {
            let getUser = await userModel
                .findOne({
                    where: { isDeleted: false, id: id },
                    include: [{
                        model: roleModel,
                        as: 'role',
                        attributes: ['name']
                    }]
                })
            return getUser;
        } catch (error) {
            return false
        }
    }
}