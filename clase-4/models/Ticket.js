const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  subtotal: {
    type: Number,
    default: 0
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Products'
  }]
}, { timestamps: true});

const Tickets = mongoose.model('Tickets', TicketSchema);

module.exports = Tickets;