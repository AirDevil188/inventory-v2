const { Router } = require("express");

const indexRouter = Router();
const gameController = require("../controllers/gameController");

indexRouter.get("/", gameController.getIndex);

indexRouter.get("/create-game", gameController.getCreateGameForm);

indexRouter.post("/create-game", gameController.postCreateGameForm);

indexRouter.get("/game/:id", gameController.getGameDetail);

module.exports = indexRouter;
