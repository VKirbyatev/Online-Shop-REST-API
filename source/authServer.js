import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import { createDbConnection } from './database';
import { errorHandler } from './middlewares/errorHandler';
import { initConfig, getConfig } from './config';

initConfig();
createDbConnection();
const config = getConfig();
const expressServer = express();

expressServer.use(cors());
expressServer.use(morgan('combined'));
expressServer.use(bodyParser.json());
expressServer.use('/api/user', authRoutes);
expressServer.use(errorHandler);

expressServer.listen(config.authServerPort, () => console.log('Start AuthServer'));
