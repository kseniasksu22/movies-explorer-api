/* eslint-disable max-len */
const moviesModel = require("../models/movie");
const NotFoundErr = require("../errors/NotFoundErr");
const BadRequestErr = require("../errors/BadRequestErr");
const ServerErr = require("../errors/ServerErr");
const ForbiddenErr = require("../errors/ForbiddenErr");

const {
  badRequestError, forbiddenErr, notFoundErr, serverErr, statusOk
} = require("../utils/errorTexts.js");

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
        throw new BadRequestErr(badRequestError.fatal);
      }
      moviesModel.findById(movie._id).populate("owner").then((item) => {
        res.send({ data: item });
      });
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        throw new BadRequestErr(badRequestError.fatalMovieCreated);
      } else {
        throw new ServerErr(serverErr.error);
      }
    }).catch(next);
};

const deleteMovie = (req, res, next) => {
  moviesModel
    .findById(req.params.movieId)
    .then((movie) => {
      console.log(movie);
      if (!movie) {
        throw new NotFoundErr(notFoundErr.movieId);
      }

      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenErr(forbiddenErr.deleteMovie);
      }
      moviesModel.deleteOne(movie)
        .then(() => {
          return res.send({ message: statusOk.deleteMovie });
        }).catch(next);
    }).catch(next);
};

module.exports = {
  getMovie,
  createMovie,
  deleteMovie,
};
