const router = require("express").Router();
const {
  updateUserInfo,
  getCurrentUser,
} = require("../controllers/users.js");

const { userInfoValidalidator } = require("../middlewares/validator");

router.get("/users/me", getCurrentUser);
router.patch("/users/me", userInfoValidalidator, updateUserInfo);

module.exports = router;
