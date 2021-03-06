import mongoose from 'mongoose';
import Tables from './tables';

const cartSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: Tables.USER, required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: Tables.PRODUCT, required: true },
      quantity: { type: Number, default: 1 },
    },
  ],
});

export default mongoose.model(Tables.CART, cartSchema);
