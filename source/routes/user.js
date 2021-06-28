import express from 'express';
import bcrypt from 'bcrypt';
import { NetworkError } from '../utils';
import { systemMessages } from '../config';
import { tokenAuth } from '../middlewares';

import { Models } from '../database';

const router = express.Router();

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

router.delete('/:userId', tokenAuth, async (req, res, next) => {
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
