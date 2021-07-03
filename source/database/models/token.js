import mongoose from 'mongoose';
import Tables from './tables';

const tokenSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: Tables.USER, required: true },
  token: { type: String, required: true },
  exp: { type: String, required: true },
  iat: { type: String, required: true },
});

export default mongoose.model(Tables.TOKEN, tokenSchema);
