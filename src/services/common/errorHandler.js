const errorHandler = (err, req, res, next) => {
  console.error('🔥 Error Handler:', err.stack || err.message);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};

module.exports = { errorHandler };
