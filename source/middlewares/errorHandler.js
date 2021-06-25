import { getConfig } from '../config';

export const errorHandler = (error, req, res, next) => {
  const config = getConfig();
  const { code = 500, message = 'Something went wrong' } = error;
  if (config.nodeEnv === 'development') {
    // only use in development
    // eslint-disable-next-line no-console
    console.error(`Found error: ${code} ${message}`);
  }
  res.status(code).json({ code, message });
  next();
};
