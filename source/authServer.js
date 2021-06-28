import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes';
import { createDbConnection } from './database';
import { errorHandler } from './middlewares/errorHandler';
import { initConfig, getConfig } from './config';

initConfig();
createDbConnection();
const config = getConfig();
const expressServer = express();

expressServer.use(morgan('combined'));
expressServer.use(bodyParser.json());
expressServer.use(errorHandler);
expressServer.use('/api/user', authRoutes);

expressServer.listen(config.authServerPort, () => console.log('Start AuthServer'));
