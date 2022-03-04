const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    validate: {
      validator(value) {
        if (!validator.isURL(value)) {
          throw new Error('Некорректная ссылка');
        }
      },
    },
  },
  trailerLink: {
    type: String,
    validate: {
      validator(value) {
        if (!validator.isURL(value)) {
          throw new Error('Некорректная ссылка');
        }
      },
    },
  },
  thumbnail: {
    type: String,
    validate: {
      validator(value) {
        if (!validator.isURL(value)) {
          throw new Error('Некорректная ссылка');
        }
      },
    },
  },
  owner: {
    type: String,
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
