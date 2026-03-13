var express = require('express');
var router = express.Router();
let slugify = require('slugify')
let productSchema = require('../schemas/products')
let categorySchema = require('../schemas/categories')
const { Op } = require("sequelize");

router.get('/', async function (req, res, next) {
  let titleQ = req.query.title ? req.query.title : '';
  let maxPrice = req.query.maxPrice ? req.query.maxPrice : 1E4;
  let minPrice = req.query.minPrice ? req.query.minPrice : 0;

  let result = await productSchema.findAll({
    where: {
      isDeleted: false,
      title: { [Op.like]: `%${titleQ}%` },
      price: { [Op.between]: [minPrice, maxPrice] }
    },
    include: [{ model: categorySchema, as: 'category', attributes: ['name', 'images'] }]
  });

  res.send(result);
});

router.get('/slug/:slug', async function (req, res, next) {
  let slug = req.params.slug;
  let result = await productSchema.findOne({
    where: { slug: slug, isDeleted: false },
    include: [{ model: categorySchema, as: 'category' }]
  })
  if (result) {
    res.status(200).send(result)
  } else {
    res.status(404).send({ message: "SLUG NOT FOUND" })
  }
});

router.get('/:id', async function (req, res, next) {
  try {
    let result = await productSchema.findOne({
      where: { id: req.params.id, isDeleted: false },
      include: [{ model: categorySchema, as: 'category' }]
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
    let newObj = await productSchema.create({
      title: req.body.title,
      slug: slugify(req.body.title, {
        replacement: '-', lower: true, locale: 'vi',
      }),
      price: req.body.price,
      description: req.body.description,
      categoryId: req.body.categoryId || req.body.category,
      images: req.body.images
    })
    res.send(newObj);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
})

router.put('/:id', async function (req, res, next) {
  try {
    // If category is passed as an object or field instead of categoryId, normalize it
    let updateData = { ...req.body };
    if (updateData.category && !updateData.categoryId) {
      updateData.categoryId = updateData.category;
    }

    let [updatedCount] = await productSchema.update(updateData, {
      where: { id: req.params.id }
    })
    if (updatedCount === 0) return res.status(404).send({ message: "ID NOT FOUND" });

    let result = await productSchema.findByPk(req.params.id);
    res.status(200).send(result)
  } catch (error) {
    res.status(404).send({ message: "ID NOT FOUND" })
  }
})

router.delete('/:id', async function (req, res, next) {
  try {
    let [updatedCount] = await productSchema.update({ isDeleted: true }, {
      where: { id: req.params.id }
    })
    if (updatedCount === 0) return res.status(404).send({ message: "ID NOT FOUND" });
    let result = await productSchema.findByPk(req.params.id);
    res.status(200).send(result)
  } catch (error) {
    res.status(404).send({ message: "ID NOT FOUND" })
  }
})

module.exports = router;
