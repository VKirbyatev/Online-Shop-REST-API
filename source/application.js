import express from 'express';
import mongoose from 'mongoose';
import { getConfig, initConfig } from './config';
import { createDbConnection } from './database';
import bodyParser from 'body-parser';

import productRoutes from './routes/products';
import userRoutes from './routes/user';

class Application {
  start = () => {
    initConfig();

    createDbConnection();

    let config = getConfig();
    let expressServer = express();

    expressServer.get('/', (req, res) => {
      res.send('Welcome to Node Babel');
    });

    expressServer.listen(config.port, this.onStart);
    expressServer.use(bodyParser.json());
    expressServer.use('/api/user', userRoutes);
    expressServer.use('/api/products', productRoutes);
  };

  onStart = () => {
    console.log('Start Listening');
  };
}

export default new Application();
