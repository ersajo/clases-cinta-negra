const express = require('express');
const router = express.Router();

const Products = require('../models/Products');

router.post('/product', async (req, res, next) => {
  try {
    const { name, price, stock } = req.body;
    const criteria = await Products.exists({ name: name });
    if (!criteria) {
      const productToSave = new Products(
        {
          name,
          price,
          stock
        }
      );
      const savedDoc = await productToSave.save();
      
      res.send({message: 'Document created', doc: savedDoc}).stauts(201);
    } else {
      throw new Error('Ya existe ese producto');
    }
  } catch (error) {
    res.send({ message: error.message, body: req.body }).stauts(400);
    next(error);
  }
});

router.get('/product/:id', async (req, res) => {
  try {
    const product = await Products
      .findById(req.params.id);
    res.send({ message: 'Petición exitosa', product: product }).status(201);
  } catch (error) {
    res.send({ message: error.message }).status(400);
  }
});

router.put('/product/:id', async (req, res) => {
  try {
    const product = await Products
      .updateOne({ _id: req.params.id }, {
        $set: {
          name: req.body.name,
          price: req.body.price,
          stock: {
            store: req.body.stock.store,
            qnty: req.body.stock.qnty
          }
        }
      });
    res.send({ message: 'Actualización exitosa', product: product }).status(201);
  } catch (error) {
    res.send({ message: error.message }).status(400);
  }
});

router.delete('/product/:id', async (req, res) => {
  try {
    const product = await Products
      .deleteOne({ _id: req.params.id });
    res.send({ message: 'Se elimino el producto exitosamente', product: product }).status(201);
  } catch (error) {
    res.send({ message: error.message }).status(400);
  }
});

module.exports = router;