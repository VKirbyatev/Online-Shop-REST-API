import dotenv from 'dotenv';

const initConfig = () => {
  dotenv.config();
};

const getConfig = () => ({
  // Server params
  jwtKey: process.env.JWT_KEY,
  port: process.env.PORT,
  jwtLifeTime: process.env.JWT_LIFETIME,
  nodeEnv: process.env.NODE_ENV,

  // Database params
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  dbName: process.env.DB_NAME,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbURL: process.env.DB_CONNECTION_URL,
});

export { initConfig, getConfig };
