import mongoose from 'mongoose';
import { getConfig } from '../../config';
import Tables from './tables';

const config = getConfig();

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match:
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  password: { type: String, required: true },
  creationDate: { type: Date, default: Date.now() },
  role: { type: String, default: config.roles.BASIC },
  deleted: { type: Boolean, default: false },
});

export default mongoose.model(Tables.USER, userSchema);
