import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NetworkError } from '../utils';
import { getConfig, systemMessages } from '../config';

import { Models } from '../database';

const router = express.Router();
const { Token, User } = Models;

router.post('/login', async ({ body }, response, next) => {
  try {
    const user = await User.findOne({ email: body.email, deleted: false }).exec();
    if (!user || user.deleted) {
      throw new NetworkError(401, systemMessages.auth_fail);
    } else {
      const result = await bcrypt.compare(body.password, user.password);
      if (result) {
        const config = getConfig();

        // eslint-disable-next-line object-curly-newline
        const { _id: id, email, name, role } = user;

        const accessToken = jwt.sign(
          {
            id,
            email,
            name,
            role,
          },
          config.jwtAccessKey,
          {
            expiresIn: config.jwtAccessLifeTime,
          },
        );

        const refreshToken = jwt.sign(
          {
            id,
            email,
            name,
            role,
          },
          config.jwtRefreshKey,
          {
            expiresIn: config.jwtRefreshLifeTime,
          },
        );

        const decoded = jwt.decode(refreshToken);

        await Token.findOneAndDelete({ userId: id });
        await new Token({
          userId: id,
          token: refreshToken,
          exp: decoded.exp,
          iat: decoded.iat,
        }).save();
        response.status(200).json({ accToken: accessToken, refToken: refreshToken });
      } else {
        throw new NetworkError(401, systemMessages.auth_fail);
      }
    }
  } catch (error) {
    next(error);
  }
});

router.post('/refresh-token', async ({ body: { token } }, res, next) => {
  const refreshToken = token;
  const config = getConfig();

  try {
    const decoded = jwt.decode(token);
    const oldToken = await Token.findOne({ userId: decoded.id });
    if (!refreshToken || oldToken.token !== token) {
      throw new NetworkError(403, systemMessages.access_denied);
    } else {
      const verified = jwt.verify(refreshToken, config.jwtRefreshKey);
      const newRefreshToken = jwt.sign({ verified }, config.jwtRefreshKey, {
        expiresIn: config.jwtRefreshLifeTime,
      });
      const accessToken = jwt.sign({ verified }, config.jwtAccessKey, {
        expiresIn: config.jwtAccessLifeTime,
      });

      await Token.findOneAndDelete({ userId: verified.id });
      await new Token({
        userId: verified.id,
        token: newRefreshToken,
        exp: decoded.exp,
        iat: decoded.iat,
      }).save();
      res.status(200).json({ accToken: accessToken, refToken: newRefreshToken });
    }
  } catch (error) {
    next(error);
  }
});

router.delete('/logout', async ({ body: { token } }, res) => {
  const decode = jwt.decode(token);
  await Token.findOneAndDelete({ userId: decode.id });
  res.status(410).json({ message: systemMessages.logout });
});

export default router;
