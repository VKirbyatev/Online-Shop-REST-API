import mongoose from 'mongoose';
import Tables from './tables';

const reviewSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: Tables.USER },
  article: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: String, default: Date.now() },
  deleted: { type: Boolean, default: false },
});

export default mongoose.model(Tables.REVIEW, reviewSchema);
