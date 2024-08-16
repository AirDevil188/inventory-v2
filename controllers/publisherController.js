const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const db = require("../db/queries");
const indexController = require("../controllers/indexController");

const getPublishers = asyncHandler(async (req, res, next) => {
  const publishers = await db.getPublishers();

  res.render("publishers", {
    title: "All Publishers",
    navLinks: indexController.navLinks,
    publishers: publishers,
  });
});

module.exports = getPublishers;
