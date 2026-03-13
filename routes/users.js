var express = require("express");
var router = express.Router();
let { checkLogin } = require('../utils/authHandler')
let { userCreateValidator, userUpdateValidator, handleResultValidator } = require('../utils/validatorHandler')
let userController = require("../controllers/users");
let userModel = require('../schemas/users'); // Needed for some logic

router.get("/", checkLogin, async function (req, res, next) {
    let users = await userController.GetAllUser();
    res.send(users);
});

router.get("/:id", async function (req, res, next) {
    try {
        let result = await userController.FindById(req.params.id);
        if (result) {
            res.send(result);
        } else {
            res.status(404).send({ message: "id not found" });
        }
    } catch (error) {
        res.status(404).send({ message: "id not found" });
    }
});

router.post("/", userCreateValidator, handleResultValidator,
    async function (req, res, next) {
        try {
            let newItem = userController.CreateAnUser(
                req.body.username, req.body.password, req.body.email,
                req.body.role || 1, req.body.fullName,
                req.body.avatarUrl, req.body.status, req.body.loginCount || 0
            )
            await newItem.save();
            let saved = await userController.FindById(newItem.id);
            res.send(saved);
        } catch (err) {
            res.status(400).send({ message: err.message });
        }
    });

router.put("/:id", userUpdateValidator, handleResultValidator, async function (req, res, next) {
    try {
        let id = req.params.id;
        let [updatedCount] = await userModel.update(req.body, { where: { id: id } });

        if (updatedCount === 0)
            return res.status(404).send({ message: "id not found" });

        let populated = await userController.FindById(id);
        res.send(populated);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

router.delete("/:id", async function (req, res, next) {
    try {
        let id = req.params.id;
        let [updatedCount] = await userModel.update(
            { isDeleted: true },
            { where: { id: id } }
        );
        if (updatedCount === 0) {
            return res.status(404).send({ message: "id not found" });
        }
        let updatedItem = await userModel.findByPk(id);
        res.send(updatedItem);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

module.exports = router;