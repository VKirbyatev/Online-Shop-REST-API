import jwt from 'jsonwebtoken';
import { NetworkError } from '../utils';
import { systemMessages, getConfig } from '../config';

export const tokenAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  const config = getConfig();

  try {
    if (!token) {
      throw new NetworkError(401, systemMessages.auth_fail);
    } else {
      jwt.verify(token, config.jwtAccessKey, (err, user) => {
        if (err) {
          throw new NetworkError(403, systemMessages.access_denied);
        } else {
          req.userData = user;
          next();
        }
      });
    }
  } catch (error) {
    next(error);
  }
};
