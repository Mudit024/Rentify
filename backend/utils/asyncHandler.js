// Wraps an async controller, forwarding any rejected promise to Express's error middleware
const asyncHandler = (requestHandler) => (req, res, next) => {
  Promise.resolve(requestHandler(req, res, next)).catch(next);
};

export default asyncHandler;
