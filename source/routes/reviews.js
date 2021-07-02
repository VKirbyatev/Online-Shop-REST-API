import express from 'express';
import { paginateResult, tokenAuth } from '../middlewares';
import { getConfig, initConfig, systemMessages } from '../config';
import { Models } from '../database';
import { NetworkError } from '../utils';
import { roleAuth } from '../middlewares/roleAuth';

const router = express.Router();
initConfig();
const config = getConfig();

router.get('/', tokenAuth, paginateResult(Models.Review), async (req, res) => {
  res.status(200).json(res.paginateResult);
});

router.post('/', tokenAuth, async ({ userData: { id }, body: { article, text } }, res, next) => {
  try {
    const { Review } = Models;
    const reviewInstance = await new Review({
      user: id,
      article,
      text,
    }).save();
    res.status(200).json(reviewInstance);
  } catch (error) {
    next(error);
  }
});

router.put(
  '/:reviewId',
  tokenAuth,
  roleAuth([config.roles.MANAGER]),
  async ({ body, params: { reviewId } }, res, next) => {
    const id = reviewId;
    const { Review } = Models;
    const updateParams = {};

    try {
      body.forEach((property) => {
        updateParams[property.key] = property.value;
        if (property.key === 'deleted' || property.key === 'date' || property.key === 'user') {
          throw new NetworkError(403, systemMessages.bad_property);
        }
      });

      const updateReview = await Review.findOneAndUpdate(
        { _id: id, deleted: false },
        { $set: updateParams },
        { returnOriginal: false },
      );

      if (updateReview) {
        res.status(200).json(updateReview);
      } else {
        throw new NetworkError(404, systemMessages.review_not_found);
      }
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  '/:reviewId',
  tokenAuth,
  roleAuth([config.roles.MANAGER]),
  async ({ params: { reviewId } }, res, next) => {
    const { Review } = Models;
    try {
      await Review.updateOne({ _id: reviewId }, { $set: { deleted: true } }).exec();
      res.status(200).json({
        message: systemMessages.delete_review,
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
