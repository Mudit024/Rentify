import ApiError from '../utils/ApiError.js';

const errorMiddleware = (err, req, res, next) => {
  let error = err;

  // Normalize known non-ApiError errors into ApiError shape
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || (error.name === 'ValidationError' ? 400 : 500);

    let message = error.message || 'Internal Server Error';

    // Mongoose duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue || {})[0];
      message = `${field ? field.charAt(0).toUpperCase() + field.slice(1) : 'Field'} already exists`;
      error = new ApiError(409, message);
    }
    // Mongoose CastError (bad ObjectId)
    else if (error.name === 'CastError') {
      error = new ApiError(400, `Invalid ${error.path}: ${error.value}`);
    }
    // Mongoose validation error
    else if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      error = new ApiError(400, messages.join(', '));
    } else {
      error = new ApiError(statusCode, message);
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.message,
    data: null,
    error: error.errors?.length ? error.errors : error.message,
  });
};

export default errorMiddleware;
