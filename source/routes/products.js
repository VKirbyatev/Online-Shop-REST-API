import express from 'express';
import { paginateResult, imageUpload } from '../middlewares';
import { systemMessages } from '../config';
import { Models } from '../database';
import { NetworkError } from '../utils';

const router = express.Router();

router.get('/', paginateResult(Models.Product), async (req, res) => {
  res.status(200).json(res.paginateResult);
});

router.post('/', imageUpload, async ({ body: { name, price }, file: { path } }, res, next) => {
  const { Product } = Models;
  try {
    const productInstance = await new Product({
      name,
      price,
      productImage: path,
    }).save();
    res.status(200).json(productInstance);
  } catch (error) {
    next(error);
  }
});

router.put('/:productId', async ({ body, params: { productId } }, res, next) => {
  const id = productId;
  const { Product } = Models;
  const updateParams = {};

  try {
    body.forEach((property) => {
      updateParams[property.key] = property.value;
    });

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id, deleted: false },
      { $set: updateParams },
      { returnOriginal: false }
    );

    if (updatedProduct) {
      res.status(200).json(updatedProduct);
    } else {
      throw new NetworkError(404, systemMessages.product_not_found);
    }
  } catch (error) {
    next(error);
  }
});

router.delete('/:productId', async ({ params: { productId } }, res, next) => {
  const { Product } = Models;
  try {
    await Product.updateOne({ _id: productId }, { $set: { deleted: true } }).exec();
    res.status(200).json({
      message: systemMessages.delete_product,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
