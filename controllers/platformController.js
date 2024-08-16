const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const db = require("../db/queries");
const indexController = require("../controllers/indexController");

const getPlatforms = asyncHandler(async (req, res, next) => {
  const platforms = await db.getPlatforms();

  res.render("platforms", {
    title: "All Platforms",
    navLinks: indexController.navLinks,
    platforms: platforms,
  });
});

module.exports = {
  getPlatforms,
};
