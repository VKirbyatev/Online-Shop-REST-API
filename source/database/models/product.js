import mongoose from 'mongoose';
import Tables from './tables';

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  productImage: { type: String, required: true },
  deleted: { type: Boolean, default: false },
});

export default mongoose.model(Tables.PRODUCT, productSchema);
