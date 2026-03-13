var express = require('express');
var router = express.Router();
let userController = require('../controllers/users')
let { RegisterValidator, ChangePasswordValidator, handleResultValidator } = require('../utils/validatorHandler')
let bcrypt = require('bcrypt')
let jwt = require('jsonwebtoken')
let { checkLogin } = require('../utils/authHandler')
let roleModel = require('../schemas/roles');
let fs = require('fs');
let path = require('path');
const privateKey = fs.readFileSync(path.join(__dirname, '../keys/private.key'), 'utf8');

/* GET home page. */
router.post('/register', RegisterValidator, handleResultValidator, async function (req, res, next) {
    try {
        // Find default Role (or pick first one)
        let role = await roleModel.findOne();
        let roleId = role ? role.id : 1;

        let newUser = userController.CreateAnUser(
            req.body.username,
            req.body.password,
            req.body.email,
            roleId
        );
        await newUser.save()
        res.send({
            message: "dang ki thanh cong"
        })
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});
router.post('/login', async function (req, res, next) {
    try {
        let { username, password } = req.body;
        let getUser = await userController.FindByUsername(username);
        if (!getUser) {
            return res.status(403).send("tai khoan khong ton tai")
        } else {
            if (getUser.lockTime && getUser.lockTime > Date.now()) {
                res.status(403).send("tai khoan dang bi ban");
                return;
            }
            if (bcrypt.compareSync(password, getUser.password)) {
                await userController.SuccessLogin(getUser);
                let token = jwt.sign({
                    id: getUser.id
                }, privateKey, {
                    algorithm: 'RS256',
                    expiresIn: '30d'
                })
                res.send(token)
            } else {
                await userController.FailLogin(getUser);
                res.status(403).send("thong tin dang nhap khong dung")
            }
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});
router.get('/me', checkLogin, function (req, res, next) {
    res.send(req.user)
})

router.post('/changepassword', checkLogin, ChangePasswordValidator, handleResultValidator, async function (req, res, next) {
    try {
        let user = req.user;
        let { oldpassword, newpassword } = req.body;

        if (!bcrypt.compareSync(oldpassword, user.password)) {
            return res.status(400).send({ message: "Password hien tai khong dung" });
        }

        user.password = newpassword;
        await user.save();
        res.send({ message: "Doi mat khau thanh cong" });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
