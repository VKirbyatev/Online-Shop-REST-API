import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NetworkError } from '../utils';
import { getConfig, systemMessages } from '../config';

import { Models } from '../database';

const router = express.Router();
const refTokens = new Map();

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

        refTokens.delete(body.email);
        refTokens.set(body.email, refreshToken);
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
  const decoded = jwt.decode(token);

  try {
    if (refreshToken == null || refTokens.get(decoded.email) !== token) {
      throw new NetworkError(403, systemMessages.access_denied);
    } else {
      jwt.verify(refreshToken, config.jwtRefreshKey, (err, user) => {
        if (err) {
          throw new NetworkError(403, systemMessages.access_denied);
        } else {
          const newRefreshToken = jwt.sign({ user }, config.jwtRefreshKey, {
            expiresIn: config.jwtRefreshLifeTime,
          });
          const accessToken = jwt.sign({ user }, config.jwtAccessKey, {
            expiresIn: config.jwtAccessLifeTime,
          });

          refTokens.delete(user.email);
          refTokens.set(user.email, newRefreshToken);
          res.status(200).json({ accToken: accessToken, refToken: newRefreshToken });
        }
      });
    }
  } catch (error) {
    next(error);
  }
});

router.delete('/logout', ({ body: { token } }, res) => {
  const decode = jwt.decode(token);
  refTokens.delete(decode.email);
  res.status(410).json({ message: systemMessages.logout });
});

export default router;
