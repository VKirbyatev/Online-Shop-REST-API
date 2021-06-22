import express from 'express';
import { Middlewares } from '../middlewares';
import { systemMessages } from '../config';
import { Models } from '../database';

const router = express.Router();

router.get('/', Middlewares.paginateResult(Models.Product), async (req, res) => {
  res.status(200).json(res.paginateResult);
});

router.post(
  '/',
  Middlewares.imageUpload,
  async ({ body: { name, price }, file: { path } }, res) => {
    const { Product } = Models;
    try {
      const productInstance = await new Product({
        name,
        price,
        productImage: path,
      }).save();
      res.status(200).json(productInstance);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

router.put('/:productId', async ({ body, params: { productId } }, res) => {
  const id = productId;
  const { Product } = Models;
  const updateParams = {};

  try {
    body.forEach((property) => {
      updateParams[property.key] = property.value;
    });

    await Product.updateOne({ _id: id }, { $set: updateParams });
    res.status(200).json({
      message: systemMessages.update_product,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete('/:productId', async ({ params: { productId } }, res) => {
  const { Product } = Models;
  try {
    await Product.updateOne({ _id: productId }, { $set: { deleted: true } }).exec();
    res.status(200).json({
      message: systemMessages.delete_product,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
