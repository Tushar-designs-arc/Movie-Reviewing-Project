const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || error.status || 500;

  res.status(statusCode).json({
    message: error.message || "Server error",
    errors: error.errors || undefined,
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
  });
};

module.exports = {
  notFound,
  errorHandler,
};
