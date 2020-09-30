const express = require('express');
const router = express.Router();

const Tickets = require('../models/Ticket');
const Products = require('../models/Products');

router.post('/tickets', async (req, res, next) => {
  try {
    const { products } = req.body;
    
    if(!products) throw new Error('No products in the request body');

    const productList = await Products
      .find(
        { _id: { $in: products } }
      );

    const subtotal = productList
      .reduce((acc, product) => {
        acc += product.price;
        return acc;
      }, 0);

    const newTicket = new Tickets({
      subtotal: subtotal,
      products: products
    });
    const savedDoc = await newTicket
      .save()
    res.send({ message: 'Se ha creado un ticket', doc: savedDoc }).status(201);
  } catch (error) {
    //res.send({ message: error.message }).status(400);
    next(error);
  }
});

router.get('/tickets/:id', async (req, res) => {
  try {
    const tickets = await Tickets
    .findById(req.params.id)
    .populate('products');
    if (!tickets) throw new Error('No se encontro el ticket que buscabas');
    res.send({message: 'Petición exitosa', tickets: tickets}).status(201);
  } catch (error) {
    //res.send({message: error.message}).status(400);
    next(error);
  }
});

router.put('/tickets/:id', async (req, res) => {
  try {
    const tickets = await Tickets
      .updateOne({_id: req.params.id}, {
        $set: {
          products: req.body.products,
        }
      });
    if (!tickets.nModified) throw new Error('No se pudo actualizar el ticket que buscabas');
    res.send({ message: 'Actualización exitosa', tickets: tickets }).status(201);
  } catch (error) {
    //res.send({ message: error.message }).status(400);
    next(error);
  }
});

router.delete('/tickets/:id', async(req, res) => {
  try {
    const tickets = await Tickets
      .deleteOne({_id: req.params.id});
    if (!tickets.deletedCount) throw new Error('No se pudo eliminar el ticket que buscabas');
    res.send({ message: 'Se elimino el ticket exitosamente', tickets: tickets }).status(201);
  } catch (error) {
    //res.send({ message: error.message }).status(400);
    next(error);
  }
});

module.exports = router;