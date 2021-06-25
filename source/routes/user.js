import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NetworkError } from '../utils';
import { getConfig, systemMessages } from '../config';

import { Models } from '../database';

const router = express.Router();

router.post('/signup', async ({ body: { email, password, name } }, res, next) => {
  const { User } = Models;
  const user = await User.findOne({ email, deleted: false }).exec();
  if (user) {
    throw new NetworkError(409, systemMessages.user_exists);
  } else {
    try {
      const hash = await bcrypt.hash(password, 10);
      const userInstance = await new User({
        name,
        email,
        password: hash,
      }).save();
      res.status(201).json(userInstance);
    } catch (error) {
      next(error);
    }
  }
});

router.post('/login', async ({ body }, response, next) => {
  const { User } = Models;
  try {
    const user = await User.findOne({ email: body.email, deleted: false }).exec();
    if (!user || user.deleted) {
      throw new NetworkError(401, systemMessages.auth_fail);
    } else {
      const result = await bcrypt.compare(body.password, user.password);
      if (result) {
        const config = getConfig();

        const { _id: id, email, name } = user;

        const accessToken = jwt.sign({ id, email, name }, config.jwtKey, {
          expiresIn: config.jwtLifeTime,
        });

        response.status(200).json({ accessToken });
      } else {
        throw new NetworkError(401, systemMessages.auth_fail);
      }
    }
  } catch (error) {
    next(error);
  }
});

router.delete('/:userId', async (req, res, next) => {
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
