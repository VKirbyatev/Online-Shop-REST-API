import express from 'express';
import { tokenAuth } from '../middlewares';
import { systemMessages } from '../config';
import { Models } from '../database';
import { NetworkError } from '../utils';

const router = express.Router();

router.get('/', tokenAuth, async ({ userData: { id } }, res, next) => {
  try {
    const { Cart, Product } = Models;
    const userCart = await Cart.findOne({ user: id }).exec();
    let totalPrice = 0;
    let totalQuantity = 0;

    if (userCart) {
      const result = {};

      const total = userCart.items.map(async (item) => {
        totalQuantity += item.quantity;
        const product = await Product.findById(item.product);
        totalPrice += product.price * item.quantity;
      });

      await Promise.all(total);

      result.cart = userCart;
      result.totalPrice = totalPrice;
      result.totalQuantity = totalQuantity;

      res.status(200).json(result);
    } else {
      throw new NetworkError(404, systemMessages.no_orders);
    }
  } catch (error) {
    next(error);
  }
});

router.post(
  '/',
  tokenAuth,
  async ({ body: { productId, productQuantity }, userData: { id } }, res, next) => {
    try {
      const { Cart, Product } = Models;
      const userCart = await Cart.findOne({ user: id }).exec();
      const product = await Product.findOne({ _id: productId, deleted: false }).exec();

      if (productQuantity > 0 && typeof productQuantity === 'number') {
        if (product) {
          if (userCart) {
            const repeatedProduct = userCart.items.findIndex(
              (item) => item.product.toString() === productId,
            );
            if (repeatedProduct === -1) {
              userCart.items.push({ product: productId, quantity: productQuantity });
            } else {
              userCart.items[repeatedProduct].quantity += productQuantity;
            }
            await userCart.save();
            res.status(200).json(userCart);
          } else {
            const cartInstance = await new Cart({
              user: id,
              items: { product: productId, quantity: productQuantity },
            }).save();
            res.status(200).json(cartInstance);
          }
        } else {
          throw new NetworkError(404, systemMessages.product_not_found);
        }
      } else {
        throw new NetworkError(400, systemMessages.wrong_quantity);
      }
    } catch (error) {
      next(error);
    }
  },
);

router.put(
  '/:productId',
  tokenAuth,
  async ({ userData: { id }, params: { productId }, query: { quantity } }, res, next) => {
    try {
      const { Cart } = Models;
      const userCart = await Cart.findOne({ user: id }).exec();

      if (userCart) {
        const productIndex = userCart.items.findIndex(
          (item) => item.product.toString() === productId,
        );
        if (productIndex !== -1) {
          if (quantity && quantity > 0) {
            userCart.items[productIndex].quantity = quantity;
            await userCart.save();
            res.status(200).json(userCart);
          } else {
            throw new NetworkError(400, systemMessages.wrong_quantity);
          }
        } else {
          throw new NetworkError(404, systemMessages.wrong_item);
        }
      } else {
        throw new NetworkError(404, systemMessages.no_orders);
      }
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  '/:productId',
  tokenAuth,
  async ({ userData: { id }, params: { productId } }, res, next) => {
    try {
      const { Cart } = Models;
      const userCart = await Cart.findOne({ user: id }).exec();

      if (userCart) {
        const productIndex = userCart.items.findIndex(
          (item) => item.product.toString() === productId,
        );
        if (productIndex !== -1) {
          userCart.items = userCart.items.filter((item) => item.product.toString() !== productId);
          await userCart.save();
          if (userCart.items.length) {
            res.status(200).json(userCart);
          } else {
            await Cart.findOneAndRemove({ user: id }).exec();
            res.status(200).json(systemMessages.cart_deleted);
          }
        } else {
          throw new NetworkError(404, systemMessages.wrong_item);
        }
      } else {
        throw new NetworkError(404, systemMessages.no_orders);
      }
    } catch (error) {
      next(error);
    }
  },
);

router.delete('/', tokenAuth, async ({ userData: { id } }, res, next) => {
  try {
    const { Cart } = Models;
    await Cart.findOneAndRemove({ user: id }).exec();
    res.status(200).json(systemMessages.cart_deleted);
  } catch (error) {
    next(error);
  }
});

export default router;
