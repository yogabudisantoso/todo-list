// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  // Default error status and message
  const status = err.statusCode || 500;
  const message = err.message || 'Something went wrong on the server';
  
  res.status(status).json({
    error: {
      message,
      status,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

module.exports = errorHandler;