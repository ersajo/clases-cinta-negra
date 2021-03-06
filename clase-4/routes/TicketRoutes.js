const express = require('express');
const router = express.Router();

const Tickets = require ('../models/Ticket');

router.post('/tickets', async (req, res) => {
  try {
    const newTicket = new Tickets(req.body);
    const savedDoc = await newTicket
      .save()
      .populate('products');
    res.send({ message: 'Se ha creado un ticket', doc: savedDoc }).status(201);
  } catch (error) {
    res.send({message: error.message}).status(400);
  }
});

router.get('/tickets/:id', async (req, res) => {
  try {
    const tickets = await Tickets
      .findById(req.params.id)
      .populate('products');
    res.send({message: 'Petición exitosa', tickets: tickets}).status(201);
  } catch (error) {
    res.send({message: error.message}).status(400);
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
    res.send({ message: 'Actualización exitosa', tickets: tickets }).status(201);
  } catch (error) {
    res.send({ message: error.message }).status(400);
  }
});

router.delete('/tickets/:id', async(req, res) => {
  try {
    const tickets = await Tickets
      .deleteOne({_id: req.params.id});
    res.send({ message: 'Se elimino el ticket exitosamente', tickets: tickets }).status(201);
  } catch (error) {
    res.send({ message: error.message }).status(400);
  }
});

module.exports = router;