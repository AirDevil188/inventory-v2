const { Router } = require("express");
const publisherRouter = Router();
const publisherController = require("../controllers/publisherController");

publisherRouter.get("/", publisherController.getPublishers);

module.exports = publisherRouter;
