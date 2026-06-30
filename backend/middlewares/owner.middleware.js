import ApiError from '../utils/ApiError.js';

// Must run AFTER authMiddleware
const ownerMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'owner') {
    throw new ApiError(403, 'Access denied. Owner role required.');
  }
  next();
};

export default ownerMiddleware;
