const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

const NotFoundError = require('../errors/not-found-error');
const NotCorrectError = require('../errors/not-correct-error');
const ExistEmailError = require('../errors/exist-email-error');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev-secret', { expiresIn: '7d' });

      res.send({ token });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email,
  } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.send({
      data: {
        name: user.name, email: user.email,
      },
    }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new NotCorrectError('Некорректные данные'));
      } else if (error.name === 'MongoServerError' && error.code === 11000) {
        next(new ExistEmailError('Пользователь с таким email уже существует'));
      } else {
        next(error);
      }
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new Error('Not Found'))
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.message === 'Not Found') {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
      } else {
        next(error);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .orFail(new Error('Not Found'))
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new NotCorrectError('Некорректные данные'));
      } else if (error.name === 'MongoServerError' && error.code === 11000) {
        next(new ExistEmailError('Пользователь с таким email уже существует'));
      } else if (error.message === 'Not Found') {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
      } else {
        next(error);
      }
    });
};
