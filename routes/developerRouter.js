const { Router } = require("express");

const developerRouter = Router();

const developerController = require("../controllers/developerController");

developerRouter.get("/", developerController.getDevelopers);

developerRouter.get(
  "/create-developer",
  developerController.getDeveloperCreateForm
);

developerRouter.post(
  "/create-developer",
  developerController.postDeveloperCreateForm
);

developerRouter.get("/developer/:id", developerController.getDeveloperDetails);

module.exports = developerRouter;
