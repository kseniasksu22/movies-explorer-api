const router = require("express").Router();
const {
  getMovie,
  createMovie,
  deleteMovie,
} = require("../controllers/movies.js");

const { movieCreationValidator, movieIdValidator } = require("../middlewares/validator");

router.get("/movies", getMovie);
router.post("/movies", movieCreationValidator, createMovie);
router.delete("/movies/:movieId", movieIdValidator, deleteMovie);

module.exports = router;
