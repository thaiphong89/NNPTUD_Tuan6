var express = require('express');
var router = express.Router();
let slugify = require('slugify')
let categorySchema = require('../schemas/categories')
const { Op } = require("sequelize");

router.get('/', async function (req, res, next) {
  try {
    let result = await categorySchema.findAll({ where: { isDeleted: false } });
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.get('/slug/:slug', async function (req, res, next) {
  let slug = req.params.slug;
  let result = await categorySchema.findOne({
    where: { slug: slug, isDeleted: false }
  })
  if (result) {
    res.status(200).send(result)
  } else {
    res.status(404).send({ message: "SLUG NOT FOUND" })
  }
});

router.get('/:id', async function (req, res, next) {
  try {
    let result = await categorySchema.findOne({
      where: { id: req.params.id, isDeleted: false }
    });
    if (result) {
      res.status(200).send(result)
    } else {
      res.status(404).send({ message: "ID NOT FOUND" })
    }
  } catch (error) {
    res.status(404).send({ message: "ID NOT FOUND" })
  }
});

router.post('/', async function (req, res, next) {
  try {
    let newObj = await categorySchema.create({
      name: req.body.name,
      slug: slugify(req.body.name, {
        replacement: '-', lower: true, locale: 'vi',
      }),
      description: req.body.description,
      images: req.body.images
    })
    res.send(newObj);
  } catch (error) {
    res.status(404).send(error.message);
  }
})

router.put('/:id', async function (req, res, next) {
  try {
    let [updatedCount] = await categorySchema.update(req.body, {
      where: { id: req.params.id }
    })
    if (updatedCount === 0) return res.status(404).send({ message: "ID NOT FOUND" });

    let result = await categorySchema.findByPk(req.params.id);
    res.status(200).send(result)
  } catch (error) {
    res.status(404).send({ message: "ID NOT FOUND" })
  }
})

router.delete('/:id', async function (req, res, next) {
  try {
    let [updatedCount] = await categorySchema.update({ isDeleted: true }, {
      where: { id: req.params.id }
    })
    if (updatedCount === 0) return res.status(404).send({ message: "ID NOT FOUND" });
    let result = await categorySchema.findByPk(req.params.id);
    res.status(200).send(result)
  } catch (error) {
    res.status(404).send({ message: "ID NOT FOUND" })
  }
})

module.exports = router;
