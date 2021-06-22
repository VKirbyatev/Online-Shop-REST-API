import mongoose from 'mongoose';
import Tables from './tables';

const productSchema = mongoose.Schema({
  _id: { type: mongoose.Types.ObjectId, default: new mongoose.Types.ObjectId() },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  productImage: { type: String, required: true },
  deleted: { type: Boolean, default: false },
});

export default mongoose.model(Tables.PRODUCT, productSchema);
