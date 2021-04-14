const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const NotFoundErr = require("../errors/NotFoundErr");
const ConflictErr = require("../errors/ConflictErr");
const BadRequestErr = require("../errors/BadRequestErr");
const ServerErr = require("../errors/ServerErr");

const { NODE_ENV, JWT_SECRET } = process.env;

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new BadRequestErr("Неккоректные данные");
      }
      return res.send({ data: user });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;

  if (!email || !password) {
    throw new BadRequestErr("Неккоректные данныею Передайте правильные почту или пароль");
  }
  User.findOne({ email }).then((data) => {
    if (data) {
      throw new ConflictErr("Пользователь с такой почтой уже зарегистрирован");
    }
    return bcrypt.hash(password, 10);
  })
    .then((hash) => {
      User.create({
        email,
        password: hash,
        name,
      });
    })
    .then((user) => {
      // eslint-disable-next-line max-len
      res.status(201).send(
        {
          data: user
        }
      );
    })
    .catch(next);
};

const updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  console.log(req.body);
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      console.log(user);
      res.send({ data: user });
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        throw new BadRequestErr("Неккоректные данные");
      } else if (error.name === "NotFound") {
        throw new NotFoundErr("Ресурс не найден");
      } else {
        throw new ServerErr("Ошибка сервера");
      }
    }).catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestErr("Неккоректные данные. Передайте правильные почту или пароль");
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
        { expiresIn: "7d" },
      );
      res.status(201).send({ token: token });
    })
    .catch(next);
};
module.exports = {
  createUser,
  updateUserInfo,
  login,
  getCurrentUser,

};
