const jwt = require("jsonwebtoken");

const { NODE_ENV, JWT_SECRET } = process.env;
const Unauthorized = require("../errors/Unauthorized.js");
const { unautorizedErr } = require("../utils/errorTexts.js");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    next(new Unauthorized(unautorizedErr.needAutorization));
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === "production" ? JWT_SECRET : "dev-secret");
  } catch (err) {
    next(new Unauthorized(unautorizedErr.needAutorization));
  }

  req.user = payload;

  next();
};
