import express from 'express';
import { getConfig, initConfig } from './config';
import { createDbConnection } from './database';

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
  }

  onStart = () => {
    console.log('Start Listening')
  }
}

export default new Application();