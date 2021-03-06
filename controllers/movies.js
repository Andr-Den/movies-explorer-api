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
    trailerLink,
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
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.send({ data: movie }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new NotCorrectError('Некорректные данные'));
      } else {
        next(error);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .orFail(new NotFoundError('Запрашиваемый фильм не найден'))
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id.toString()) {
        throw new NoRightsError('Нет прав на удаление фильма');
      }

      return movie.remove();
    })
    .then(() => res.send({ message: 'Фильм успешно удален' }))
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new NotCorrectError('Некорректный id'));
      } else {
        next(error);
      }
    });
};
