const { Router } = require("express");

const genreRouter = Router();

const genreController = require("../controllers/genreController");

genreRouter.get("/", genreController.getGenres);

genreRouter.get("/create-genre", genreController.createGenreFormGet);

genreRouter.post("/create-genre", genreController.createGenreFormPost);

genreRouter.get("/genre/:id", genreController.getGenreDetails);

genreRouter.get("/genre/:id/delete", genreController.deleteGenreGet);

genreRouter.post("/genre/:id/delete", genreController.deleteGenrePost);

genreRouter.get("/genre/:id/update", genreController.updateGenreGet);

genreRouter.post("/genre/:id/update", genreController.updateGenrePost);

module.exports = genreRouter;
