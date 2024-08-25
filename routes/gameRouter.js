const { Router } = require("express");

const gameRouter = Router();

const gameController = require("../controllers/gameController");

gameRouter.get("/", gameController.getGames);

gameRouter.get("/create-game", gameController.getCreateGameForm);

gameRouter.post("/create-game", gameController.postCreateGameForm);

gameRouter.get("/game/:id", gameController.getGameDetail);

gameRouter.get("/game/:id/delete", gameController.getGameDelete);

gameRouter.post("/game/:id/delete", gameController.postGameDelete);

module.exports = gameRouter;
