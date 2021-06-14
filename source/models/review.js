import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  article: { type: String, required: true },
  text: { type: String, required: true },
  Date: { type: String, default: Date.now() },
});

export default mongoose.model('Review', reviewSchema);
