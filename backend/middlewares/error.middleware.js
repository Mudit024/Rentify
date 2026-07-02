import ApiError from '../utils/ApiError.js';

const errorMiddleware = (err, req, res, next) => {
  // ── Convert well-known Mongoose / JWT errors into ApiError ─────────────

  // Mongoose duplicate key (e.g. email already exists)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'Field';
    const label = field.charAt(0).toUpperCase() + field.slice(1);
    err = new ApiError(409, `${label} already exists`);
  }

  // Mongoose CastError (invalid ObjectId in URL param)
  else if (err.name === 'CastError') {
    err = new ApiError(400, `Invalid ${err.path}: ${err.value}`);
  }

  // Mongoose ValidationError (model-level schema validation)
  else if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    err = new ApiError(400, messages.join('. '));
  }

  // JWT errors — token expired or tampered with
  else if (err.name === 'JsonWebTokenError') {
    err = new ApiError(401, 'Invalid token. Please log in again.');
  }
  else if (err.name === 'TokenExpiredError') {
    err = new ApiError(401, 'Session expired. Please log in again.');
  }

  // CORS error coming from our cors() config
  else if (err.message?.startsWith('CORS:')) {
    err = new ApiError(403, err.message);
  }

  // Multer errors (file upload)
  else if (err.name === 'MulterError') {
    const msg = err.code === 'LIMIT_FILE_SIZE'
      ? 'File too large. Maximum size is 5MB.'
      : `Upload error: ${err.message}`;
    err = new ApiError(400, msg);
  }

  // Anything else not already an ApiError
  if (!(err instanceof ApiError)) {
    const statusCode = err.statusCode || err.status || 500;
    const message = process.env.NODE_ENV === 'production'
      ? 'Internal Server Error'
      : err.message || 'Internal Server Error';
    err = new ApiError(statusCode, message);
  }

  // ── Log to console unconditionally ──────────────────────────────────
  console.error(`[${req.method}] ${req.originalUrl} → ${err.statusCode}: ${err.message}`);

  // ── Send response ─────────────────────────────────────────────────────
  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
    data: null,
    error: err.errors?.length ? err.errors : err.message,
  });
};

export default errorMiddleware;
