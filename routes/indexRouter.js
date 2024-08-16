const { Router } = require("express");

const indexRouter = Router();

const indexController = require("../controllers/indexController");
const gameController = require("../controllers/gameController");
const genreController = require("../controllers/genresController");

indexRouter.get("/", indexController.getIndex);

indexRouter.get("/create-game", gameController.getCreateGameForm);

indexRouter.post("/create-game", gameController.postCreateGameForm);

indexRouter.get("/game/:id", gameController.getGameDetail);

indexRouter.get("/genres", genreController.getGenres);

module.exports = indexRouter;
