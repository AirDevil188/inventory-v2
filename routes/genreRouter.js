const { Router } = require("express");

const genreRouter = Router();

const genreController = require("../controllers/genreController");
genreRouter.get("/", genreController.getGenres);

module.exports = genreRouter;
