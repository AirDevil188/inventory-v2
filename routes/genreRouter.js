const { Router } = require("express");

const genreRouter = Router();

const genreController = require("../controllers/genreController");

genreRouter.get("/", genreController.getGenres);

genreRouter.get("/create-genre", genreController.createGenreFormGet);

genreRouter.post("/create-genre", genreController.createGenreFormPost);

genreRouter.get("/genre/:id", genreController.getGenreDetails);

module.exports = genreRouter;
