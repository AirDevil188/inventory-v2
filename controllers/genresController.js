const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const db = require("../db/queries");
const indexController = require("./indexController");

const lengthErr = "must contain at least one character.";
const selectionErr = "must be selected.";

const getGenres = asyncHandler(async (req, res, next) => {
  const genres = await db.getGenres();

  res.render("genres", {
    title: "All Genres",
    navLinks: indexController.navLinks,
    genres: genres,
  });
});

module.exports = {
  getGenres,
};
