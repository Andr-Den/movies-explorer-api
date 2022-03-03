const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

router.get('/movies', getMovies);
router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom((value) => {
      if (!validator.isURL(value)) {
        throw new Error('Некорректная ссылка');
      }
    }),
    trailerLink: Joi.string().required().custom((value) => {
      if (!validator.isURL(value)) {
        throw new Error('Некорректная ссылка');
      }
    }),
    thumbnail: Joi.string().required().custom((value) => {
      if (!validator.isURL(value)) {
        throw new Error('Некорректная ссылка');
      }
    }),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);
router.delete('/movies/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex().length(24),
  }),
}), deleteMovie);

module.exports = router;
