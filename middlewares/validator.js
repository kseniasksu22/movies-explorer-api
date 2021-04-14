const { celebrate, Joi } = require("celebrate");
const validator = require("validator");

const movieCreationValidator = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    year: Joi.string().required(),
    duration: Joi.number().required(),
    image: Joi.string().custom((link, errs) => {
      if (validator.isURL(link)) {
        return link;
      }
      return errs.message("Невалидный URL");
    }).required(),
    trailer: Joi.string().custom((link, errs) => {
      if (validator.isURL(link)) {
        return link;
      }
      return errs.message("Невалидный URL");
    }).required(),
    thumbnail: Joi.string().custom((link, errs) => {
      if (validator.isURL(link)) {
        return link;
      }
      return errs.message("Невалидный URL");
    }),
    description: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    movieId: Joi.string().required()
  })

});

const movieIdValidator = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().alphanum().length(24)
  }),
});

const userInfoValidalidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(40),
    email: Joi.string().required().email(),
  }),
});

const loginValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const signupValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(40),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports = {
  signupValidator,
  movieCreationValidator,
  movieIdValidator,
  userInfoValidalidator,
  loginValidator,
};