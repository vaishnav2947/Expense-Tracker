// Catches anything passed to next(err) so the server never crashes on
// an unhandled failure. Kept intentionally simple for this project's scope.
function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.status || 500;
  const message = status === 500 ? 'Something went wrong' : err.message;

  res.status(status).json({ message });
}

module.exports = errorHandler;
