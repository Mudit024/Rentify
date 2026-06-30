import ApiError from '../utils/ApiError.js';

// Must run AFTER authMiddleware
const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    throw new ApiError(403, 'Access denied. Admin role required.');
  }
  next();
};

export default adminMiddleware;
