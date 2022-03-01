const jwt = require('jsonwebtoken');
const NoAuthError = require('../errors/no-auth-error');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new NoAuthError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev-secret');
  } catch (error) {
    throw new NoAuthError('Необходима авторизация');
  }

  req.user = payload;
  next();

  return false;
};
