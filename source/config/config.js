import dotenv from 'dotenv';

const initConfig = () => {
  dotenv.config();
};

const getConfig = () => ({
  port: process.env.PORT,
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  dbName: process.env.DB_NAME,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbURL: process.env.DB_CONNECTION_URL,
});

export {
  initConfig,
  getConfig,
};
