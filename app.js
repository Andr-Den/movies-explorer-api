const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-error');
require('dotenv').config();

const { PORT = 3000 } = process.env;

const ERROR_DEFAULT = 500;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.NODE_ENV === 'production' ? process.env.DB_URL : 'mongodb://localhost:27017/bitfilmsdb');

app.use(requestLogger);

app.use(require('./routes/sign'));

app.use(auth);

app.use(require('./routes/users'));

app.use(require('./routes/movies'));

app.use(errorLogger);

app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errors());

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || ERROR_DEFAULT;
  const message = statusCode === ERROR_DEFAULT ? 'На сервере произошла ошибка' : err.message;
  res.status(statusCode).send({ message });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
