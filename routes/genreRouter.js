const { Router } = require("express");

const genreRouter = Router();

const genreController = require("../controllers/genreController");

genreRouter.get("/", genreController.getGenres);

genreRouter.get("/create-genre", genreController.createGenreFormGet);

module.exports = genreRouter;
