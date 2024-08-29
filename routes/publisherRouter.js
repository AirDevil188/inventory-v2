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

publisherRouter.get(
  "/publisher/:id/delete",
  publisherController.getPublisherDelete
);

publisherRouter.post(
  "/publisher/:id/delete",
  publisherController.postPublisherDelete
);

publisherRouter.get(
  "/publisher/:id/update",
  publisherController.getPublisherUpdate
);

publisherRouter.post(
  "/publisher/:id/update",
  publisherController.postPublisherUpdate
);

module.exports = publisherRouter;
