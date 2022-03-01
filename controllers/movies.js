const Movie = require('../models/movie');

const NotFoundError = require('../errors/not-found-error');
const NotCorrectError = require('../errors/not-correct-error');
const NoRightsError = require('../errors/no-rights-error');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send({ data: movies }))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.send({ data: movie }))
    .catch((error) => {
      if (error.name === 'ValidationError') { next(new NotCorrectError('Некорректные данные')); } else {
        next(error);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new Error('Not Found'))
    .then((card) => {
      if (card.owner.toString() !== req.user._id.toString()) {
        throw new Error('No rights');
      }

      return card.remove();
    })
    .then(() => res.send({ message: 'Фильм успешно удален' }))
    .catch((error) => {
      if (error.name === 'CastError') { next(new NotCorrectError('Некорректный id')); } else if (error.message === 'Not Found') { next(new NotFoundError('Запрашиваемый фильм не найден')); } else if (error.message === 'No rights') { next(new NoRightsError('Нет прав на удаление фильма')); } else {
        next(error);
      }
    });
};
