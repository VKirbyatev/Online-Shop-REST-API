const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 },
    },
  ],
  totalQuantity: { type: Number, default: 1 },
  totalPrice: { type: Number, default: 0 },
});

module.exports = mongoose.model('Cart', cartSchema);
