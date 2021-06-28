import { getConfig, systemMessages } from '../config';
import { NetworkError } from '../utils';

export const roleAuth = (reqRoles) => (req, res, next) => {
  const currRole = req.userData.role;
  const config = getConfig();

  try {
    if ((currRole !== null && reqRoles.includes(currRole)) || currRole === config.roles.ADMIN) {
      next();
    } else {
      throw new NetworkError(403, systemMessages.access_denied);
    }
  } catch (error) {
    next(error);
  }
};
