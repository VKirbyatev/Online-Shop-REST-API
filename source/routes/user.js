import express from 'express';
import bcrypt from 'bcrypt';
import { NetworkError } from '../utils';
import { getConfig, initConfig, systemMessages } from '../config';
import { tokenAuth } from '../middlewares';

import { Models } from '../database';
import { roleAuth } from '../middlewares/roleAuth';

const router = express.Router();
initConfig();
const config = getConfig();

router.post('/signup', async ({ body: { email, password, name } }, res, next) => {
  const { User } = Models;
  const user = await User.findOne({ email, deleted: false }).exec();
  try {
    if (user) {
      throw new NetworkError(404, systemMessages.user_exists);
    } else {
      const hash = await bcrypt.hash(password, 10);
      const userInstance = await new User({
        name,
        email,
        password: hash,
      }).save();
      res.status(201).json(userInstance);
    }
  } catch (error) {
    next(error);
  }
});

router.put(
  '/:userId',
  tokenAuth,
  roleAuth([config.roles.ADMIN]),
  async ({ body, params: { userId } }, res, next) => {
    const id = userId;
    const { User } = Models;
    const updateParams = {};

    try {
      body.forEach((property) => {
        updateParams[property.key] = property.value;
        if (
          property.key === 'deleted' ||
          property.key === 'password' ||
          property.key === 'creationDate'
        ) {
          throw new NetworkError(403, systemMessages.bad_property);
        }
      });

      const updatedUser = await User.findOneAndUpdate(
        { _id: id, deleted: false },
        { $set: updateParams },
        { returnOriginal: false },
      );

      if (updatedUser) {
        res.status(200).json(updatedUser);
      } else {
        throw new NetworkError(404, systemMessages.product_not_found);
      }
    } catch (error) {
      next(error);
    }
  },
);

router.delete('/:userId', tokenAuth, roleAuth([config.roles.ADMIN]), async (req, res, next) => {
  const { User } = Models;
  try {
    await User.updateOne({ _id: req.params.userId }, { $set: { deleted: true } }).exec();
    res.status(200).json({
      message: systemMessages.delete_user,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
