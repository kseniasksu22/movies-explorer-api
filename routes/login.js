const router = require("express").Router();
const {
  createUser,
  login,
} = require("../controllers/users");

const { loginValidator, signupValidator } = require("../middlewares/validator");

const usersRouter = require("./users.js");
const moviesRouter = require("./movies.js");

const auth = require("../middlewares/auth");

router.post("/signin", loginValidator, login);
router.post("/signup", signupValidator, createUser);

router.use("/", auth, moviesRouter);
router.use("/", auth, usersRouter);

module.exports = router;
