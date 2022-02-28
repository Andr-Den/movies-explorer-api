const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');

const NoAuthError = require('../errors/no-auth-error');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Некорректные данные');
        }
      },
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.statics.findUserByCredentials = function Credentials(email, password, name) {
  return this.findOne({ email, name }).select('+password')
    .then((user) => {
      if (!user) {
        throw new NoAuthError('Неправильные почта, имя или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new NoAuthError('Неправильные почта, имя или пароль');
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
