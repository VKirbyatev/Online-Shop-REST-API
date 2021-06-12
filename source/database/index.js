import mongoose from 'mongoose';
import { getConfig } from '../config';

export const createDbConnection = async () => mongoose.connect(getConfig().dbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});
