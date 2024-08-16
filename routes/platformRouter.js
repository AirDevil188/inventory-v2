const { Router } = require("express");

const platformRouter = Router();

const platformController = require("../controllers/platformController");

platformRouter.get("/", platformController.getPlatforms);

module.exports = platformRouter;
