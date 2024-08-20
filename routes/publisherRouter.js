const { Router } = require("express");
const publisherRouter = Router();
const publisherController = require("../controllers/publisherController");

publisherRouter.get("/", publisherController.getPublishers);

publisherRouter.get(
  "/create-publisher",
  publisherController.getCreatePublisherGet
);

module.exports = publisherRouter;
