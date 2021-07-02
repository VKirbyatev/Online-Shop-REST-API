import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import { getConfig, initConfig } from './config';
import { createDbConnection } from './database';
import productRoutes from './routes/products';
import userRoutes from './routes/user';
import cartRoutes from './routes/cart';
import reviewRoutes from './routes/reviews';
import { errorHandler } from './middlewares/errorHandler';

class Application {
  start = () => {
    initConfig();

    createDbConnection();

    const config = getConfig();
    const expressServer = express();

    expressServer.get('/', (req, res) => {
      res.send('Welcome to Node Babel');
    });

    expressServer.listen(config.serverPort, this.onStart);
    expressServer.use(bodyParser.json());
    expressServer.use(morgan('combined'));
    expressServer.use('/api/user', userRoutes);
    expressServer.use('/api/products', productRoutes);
    expressServer.use('/api/cart', cartRoutes);
    expressServer.use('/api/reviews', reviewRoutes);
    expressServer.use(errorHandler);
  };

  onStart = () => {
    console.log('Start Listening');
  };
}

export default new Application();
