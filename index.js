const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { errors } = require("celebrate");
require("dotenv").config();
const parser = require("body-parser");

const { requestLogger, errorLogger } = require("./middlewares/logger");
const NotFoundErr = require("./errors/NotFoundErr");
const { notFoundErr, serverErr } = require("./utils/errorTexts.js");
const dataBaseUrl = require("./utils/config.js");

const { PORT = 3000 } = process.env;

const app = express();

const options = {
  origin: [
    "http://localhost:3000",
    "https://moviesksu.nomoredomains.club",
    "http://moviesksu.nomoredomains.club",
    "https://api.moviesksu.nomoredomains.club",
    "http://api.moviesksu.nomoredomains.club",
  ],
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ["Content-Type", "origin", "Authorization"],
  credentials: true,
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20000
});

const router = require("./routes/login");

mongoose
  .connect(dataBaseUrl, {
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

app.use("*", cors(options));
app.use(helmet());

app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

app.use(requestLogger);
app.use(limiter);

app.use("/", router);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Сервер сейчас упадёт");
  }, 0);
});

app.use("*", () => {
  throw new NotFoundErr(notFoundErr.notFoundPage);
});

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(500).send({ message: serverErr.error });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`app listen on ${PORT}`);
});
