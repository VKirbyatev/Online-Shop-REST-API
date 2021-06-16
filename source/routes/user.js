import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getConfig } from '../config';

import { Models } from '../database';

const router = express.Router();

router.post('/signup', async (req, res, next) => {
  const { User } = Models;
  const user = await User.find({ email: req.body.email }).exec();
  if (user.length >= 1) {
    res.status(409).json({
      message: 'User already exist',
    });
  } else {
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
      if (err) {
        res.status(500).json({
          error: err,
        });
      } else {
        const userInstance = new User({
          _id: new mongoose.Types.ObjectId(),
          name: req.body.name,
          email: req.body.email,
          password: hash,
        });
        try {
          const newUser = await userInstance.save();
          res.status(201).json({
            message: 'User created',
            newUser,
          });
        } catch (userErr) {
          res.status(500).json({
            error: userErr,
          });
        }
      }
    });
  }
});

router.post('/login', async (req, response, next) => {
  const { User } = Models;
  try {
    const user = await User.find({ email: req.body.email }).exec();
    if (user.length < 1) {
      response.status(401).json({
        message: 'Authefication failed',
      });
    } else {
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          response.status(401).json({
            message: 'Authefication failed',
          });
        } else if (result) {
          const config = getConfig();

          const jwtToken = jwt.sign(
            {
              id: user[0]._id,
              name: user[0].name,
              email: user[0].email,
            },
            config.jwtKey,
            {
              expiresIn: '12h',
            }
          );
          response.status(200).json({
            message: 'Authefication succesful',
            token: jwtToken,
          });
        } else {
          response.status(401).json({
            message: 'Authefication failed',
          });
        }
      });
    }
  } catch (err) {
    response.status(500).json({
      error: err,
    });
  }
});

router.delete('/:userId', async (req, res, next) => {
  const { User } = Models;
  try {
    await User.updateOne({ _id: req.params.userId }, { $set: { deleted: true } }).exec();
    res.status(200).json({
      message: 'User deleted',
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
});

export default router;
