const express = require('express');
const router = express.Router();

const Products = require('../models/Products');

router.post('/product', async (req, res, next) => {
  try {
    const { name, price, stock } = req.body;
    
    if (!name) throw new Error('No name in the request body');
    if (!price) throw new Error('No price in the request body');
    if (!stock) throw new Error('No stock in the request body');
    
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
    //res.send({ message: error.message, body: req.body }).stauts(400);
    next(error);
  }
});

router.get('/product/:id', async (req, res, next) => {
  try {
    const product = await Products
      .findById(req.params.id);
    if (!product) throw new Error('No se encontro el producto que buscabas');
    res.send({ message: 'Petición exitosa', product: product }).status(201);
  } catch (error) {
    //res.send({ message: error.message }).status(400);
    next(error);
  }
});

router.put('/product/:id', async (req, res, next) => {
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
    if (!product.nModified) throw new Error('No se pudo actualizar el producto que buscabas');
    res.send({ message: 'Actualización exitosa', product: product }).status(201);
  } catch (error) {
    //res.send({ message: error.message }).status(400);
    next(error);
  }
});

router.delete('/product/:id', async (req, res, next) => {
  try {
    const product = await Products
      .deleteOne({ _id: req.params.id });
    if (!product.deletedCount) throw new Error('No se pudo eliminar el producto que buscabas');
    res.send({ message: 'Se elimino el producto exitosamente', product: product }).status(201);
  } catch (error) {
    //res.send({ message: error.message }).status(400);
    next(error);
  }
});

module.exports = router;