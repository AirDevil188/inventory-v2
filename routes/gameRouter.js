const { Router } = require("express");

const gameRouter = Router();

const gameController = require("../controllers/gameController");

gameRouter.get("/", gameController.getGames);

gameRouter.get("/create-game", gameController.getCreateGameForm);

gameRouter.post("/create-game", gameController.postCreateGameForm);

gameRouter.get("/game/:id", gameController.getGameDetail);

module.exports = gameRouter;
