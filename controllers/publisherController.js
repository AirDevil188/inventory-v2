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

const getCreatePublisherGet = asyncHandler(async (req, res, next) => {
  res.render("publisher_form", {
    title: "Create Publisher",
    navLinks: indexController.navLinks,
  });
});

module.exports = { getPublishers, getCreatePublisherGet };
