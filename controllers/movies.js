/* eslint-disable max-len */
const moviesModel = require("../models/movie");
const NotFoundErr = require("../errors/NotFoundErr");
const BadRequestErr = require("../errors/BadRequestErr");
const ServerErr = require("../errors/ServerErr");
const ForbiddenErr = require("../errors/ForbiddenErr");

const getMovie = (req, res, next) => {
  moviesModel
    .find({})
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image, trailer, thumbnail, movieId, nameRU, nameEN
  } = req.body;
  moviesModel
    .create({
      country, director, duration, year, description, image, trailer, thumbnail, owner: req.user._id, movieId, nameRU, nameEN
    })
    .then((movie) => {
      if (!movie) {
        throw new BadRequestErr("Нет такого фильма");
      }
      moviesModel.findById(movie._id).populate("owner").then((item) => {
        res.send({ data: item });
      });
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        throw new BadRequestErr("Некорректный Url или название");
      } else {
        throw new ServerErr("Ошибка сервера");
      }
    }).catch(next);
};

const deleteMovie = (req, res, next) => {
  moviesModel
    .findById(req.params.movieId)
    .then((movie) => {
      console.log(movie);
      if (!movie) {
        throw new NotFoundErr("Фильм не найден");
      }

      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenErr("Невозможно удалить Фильм");
      }
      moviesModel.deleteOne(movie)
        .then(() => {
          return res.send({ message: "Фильм удалён" });
        }).catch(next);
    }).catch(next);
};

module.exports = {
  getMovie,
  createMovie,
  deleteMovie,
};
