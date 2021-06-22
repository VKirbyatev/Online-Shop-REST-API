import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getConfig, systemMessages } from '../config';

import { Models } from '../database';

const router = express.Router();

router.post('/signup', async ({ body: { email, password, name } }, res) => {
  const { User } = Models;
  const user = await User.findOne({ email }).exec();
  if (user) {
    res.status(409).json({
      message: systemMessages.user_exists,
    });
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
      res.status(500).json(error);
    }
  }
});

router.post('/login', async ({ body }, response) => {
  const { User } = Models;
  try {
    const user = await User.findOne({ email: body.email }).exec();
    if (!user) {
      response.status(401).json({
        message: systemMessages.auth_fail,
      });
    } else if (user.deleted) {
      response.status(401).json({
        message: systemMessages.auth_fail,
      });
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
        response.status(401).json({
          message: systemMessages.auth_fail,
        });
      }
    }
  } catch (error) {
    response.status(500).json(error);
  }
});

router.delete('/:userId', async (req, res) => {
  const { User } = Models;
  try {
    await User.updateOne({ _id: req.params.userId }, { $set: { deleted: true } }).exec();
    res.status(200).json({
      message: systemMessages.delete_user,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
