exports.authenticateUser = (req, res, next) => {
  if (!req.user) {
    let err = new Error('Requires authentication.');
    err.status = 401;
    return next(err);
  }
  next();
}