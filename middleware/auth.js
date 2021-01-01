const jwt = require('jsonwebtoken');
const BaseError = require('../exceptions/BasrError');

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    throw new BaseError('No token,authorization denied', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWTSECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    next(new BaseError('Token is not valid', 401));
  }
};
