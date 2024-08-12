const { Router } = require("express");

const indexRouter = Router();
const gameController = require("../controllers/gameController");

gameController.get("/", indexController.getIndex);

gameController.get("/create-game", indexController.getCreateGameForm);

module.exports = indexRouter;
