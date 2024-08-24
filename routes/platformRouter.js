const { Router } = require("express");

const platformRouter = Router();

const platformController = require("../controllers/platformController");

platformRouter.get("/", platformController.getPlatforms);

platformRouter.get(
  "/create-platform",
  platformController.getCreatePlatformForm
);

platformRouter.post(
  "/create-platform",
  platformController.postCreatePlatformForm
);

platformRouter.get("/platform/:id", platformController.getPlatformDetails);

platformRouter.get(
  "/platform/:id/delete",
  platformController.getDeletePlatform
);

module.exports = platformRouter;
