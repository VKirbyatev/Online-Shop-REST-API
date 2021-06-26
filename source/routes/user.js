import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NetworkError } from '../utils';
import { getConfig, systemMessages } from '../config';
import { tokenAuth } from '../middlewares';

import { Models } from '../database';

const router = express.Router();
let refTokens = [];

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

        const accessToken = jwt.sign({ id, email, name }, config.jwtAccessKey, {
          expiresIn: config.jwtAccessLifeTime,
        });

        const refreshToken = jwt.sign({ id, email, name }, config.jwtRefreshKey, {
          expiresIn: config.jwtRefreshLifeTime,
        });

        refTokens.push(refreshToken);
        response.status(200).json({ accToken: accessToken, refToken: refreshToken });
      } else {
        throw new NetworkError(401, systemMessages.auth_fail);
      }
    }
  } catch (error) {
    next(error);
  }
});

router.post('/refresh-token', ({ body: { token } }, res, next) => {
  const refreshToken = token;
  const config = getConfig();

  try {
    if (refreshToken == null || !refTokens.includes(refreshToken)) {
      throw new NetworkError(403, systemMessages.access_denied);
    } else {
      jwt.verify(refreshToken, config.jwtRefreshKey, (err, user) => {
        if (err) {
          throw new NetworkError(403, systemMessages.access_denied);
        } else {
          const accessToken = jwt.sign({ user }, config.jwtAccessKey, {
            expiresIn: config.jwtAccessLifeTime,
          });
          res.status(200).json(accessToken);
        }
      });
    }
  } catch (error) {
    next(error);
  }
});

router.delete('/logout', ({ body: { token } }, res) => {
  refTokens = refTokens.filter((rToken) => rToken !== token);
  res.status(200).json({ message: systemMessages.logout });
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
