import mongoose from 'mongoose';
import { getConfig } from '../config';
import Cart from './models/cart';
import User from './models/user';
import Review from './models/review';
import Product from './models/product';

export const createDbConnection = async () =>
  mongoose.connect(getConfig().dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });

export const Models = {
  Cart,
  User,
  Product,
  Review,
};
