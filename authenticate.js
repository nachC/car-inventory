exports.authenticateUser = (req, res, next) => {
  if (!req.user) {
    let err = new Error('Requires authentication. Redirect to /login');
    err.status = 401;
    return res.json({ error: err.status, message: err.message });
  }
  next();
}