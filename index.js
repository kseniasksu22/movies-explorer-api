const express = require("express");

const mongoose = require("mongoose");

const rateLimit = require("express-rate-limit");
const { errors } = require("celebrate");
require("dotenv").config();
const parser = require("body-parser");
const {
  createUser,
  login,
} = require("./controllers/users");
const { loginValidator, signupValidator } = require("./middlewares/validator");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const NotFoundErr = require("./errors/NotFoundErr");
const auth = require("./middlewares/auth");

const app = express();
const PORT = 3000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20000
});

const usersRouter = require("./routes/users.js");
const moviesRouter = require("./routes/movies.js");

mongoose
  .connect("mongodb://localhost:27017/moviesdb", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to Database");
  }).catch((err) => {
    console.log("Not Connected to Database ERROR! ", err);
  });

app.use(limiter);
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

app.use(requestLogger);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Сервер сейчас упадёт");
  }, 0);
});
app.post("/signin", loginValidator, login);
app.post("/signup", signupValidator, createUser);

app.use("/", auth, usersRouter);
app.use("/", auth, moviesRouter);

app.use("*", () => {
  throw new NotFoundErr("Страница не найдена");
});

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(500).send({ message: "На сервере произошла ошибка" });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`app listen on ${PORT}`);
});
