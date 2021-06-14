import mongoose from 'mongoose';

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

export default mongoose.model('Cart', cartSchema);
