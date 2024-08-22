const { Router } = require("express");
const publisherRouter = Router();
const publisherController = require("../controllers/publisherController");

publisherRouter.get("/", publisherController.getPublishers);

publisherRouter.get(
  "/create-publisher",
  publisherController.getCreatePublisherForm
);

publisherRouter.post(
  "/create-publisher",
  publisherController.postCreatePublisherForm
);

publisherRouter.get("/publisher/:id", publisherController.getPublisherDetails);
module.exports = publisherRouter;
