import dotenv from 'dotenv';

const initConfig = () => {
  dotenv.config();
};

const getConfig = () => ({
  // Server params
  jwtAccessKey: process.env.JWT_ACCESS_KEY,
  jwtRefreshKey: process.env.JWT_REFRESH_KEY,
  serverPort: process.env.SERVER_PORT,
  authServerPort: process.env.AUTH_SERVER_PORT,
  jwtAccessLifeTime: process.env.JWT_ACCESS_LIFETIME,
  jwtRefreshLifeTime: process.env.JWT_REFRESH_LIFETIME,
  nodeEnv: process.env.NODE_ENV,

  // User Roles
  roles: {
    ADMIN: 'admin',
    MANAGER: 'manager',
    BASIC: 'basic',
  },

  // Database params
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  dbName: process.env.DB_NAME,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbURL: process.env.DB_CONNECTION_URL,
});

export { initConfig, getConfig };
