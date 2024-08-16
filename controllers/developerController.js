const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const db = require("../db/queries");
const indexController = require("./indexController");

const lengthErr = "must contain at least one character.";
const selectionErr = "must be selected.";

const getDevelopers = asyncHandler(async (req, res, next) => {
  const developers = await db.getDevelopers();

  res.render("developers", {
    title: "All Developers",
    navLinks: indexController.navLinks,
    developers: developers,
  });
});

module.exports = {
  getDevelopers,
};
