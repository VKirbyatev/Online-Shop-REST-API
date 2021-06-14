import mongoose from 'mongoose';
import Tables from './tables';

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  price: { type: Number, required: true },
  productImage: { type: String, required: true },
});

export default mongoose.model(Tables.PRODUCT, productSchema);
