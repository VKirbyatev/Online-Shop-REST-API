import mongoose from 'mongoose';
import Tables from './tables';

const cartSchema = mongoose.Schema({
  _id: { type: mongoose.Types.ObjectId, default: new mongoose.Types.ObjectId() },
  user: { type: mongoose.Schema.Types.ObjectId, ref: Tables.USER },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: Tables.PRODUCT },
      quantity: { type: Number, default: 1 },
    },
  ],
  totalQuantity: { type: Number, default: 1 },
  totalPrice: { type: Number, default: 0 },
});

export default mongoose.model(Tables.CART, cartSchema);
