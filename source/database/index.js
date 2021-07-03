import mongoose from 'mongoose';
import { getConfig } from '../config';
import User from './models/user';
import Cart from './models/cart';
import Review from './models/review';
import Product from './models/product';
import Token from './models/token';

export const createDbConnection = async () =>
  mongoose.connect(getConfig().dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });

export const Models = {
  Token,
  User,
  Cart,
  Review,
  Product,
};
