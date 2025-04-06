// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  // Default error status and message
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';
  
  res.status(statusCode).json({
    status: "error",
    message: message,
    error: {
      code: statusCode,
      details: process.env.NODE_ENV === 'development' ? err.stack : err.details || message
    }
  });
};

module.exports = errorHandler;