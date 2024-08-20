const { Router } = require("express");

const developerRouter = Router();

const developerController = require("../controllers/developerController");

developerRouter.get("/", developerController.getDevelopers);

developerRouter.get(
  "/create-developer",
  developerController.getDeveloperCreateForm
);

module.exports = developerRouter;
