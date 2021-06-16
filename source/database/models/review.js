import mongoose from 'mongoose';
import Tables from './tables';

const reviewSchema = mongoose.Schema({
  _id: { type: mongoose.Types.ObjectId, default: new mongoose.Types.ObjectId() },
  user: { type: mongoose.Schema.Types.ObjectId, ref: Tables.USER },
  article: { type: String, required: true },
  text: { type: String, required: true },
  Date: { type: String, default: Date.now() },
});

export default mongoose.model(Tables.REVIEW, reviewSchema);
