const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const db = require("../db/queries");
const indexController = require("./indexController");

const lengthErr = "must contain at least one character.";

const validateGenre = [
  body("name").trim().isLength({ min: 1 }).withMessage(`Genre ${lengthErr}`),
];

const getGenres = asyncHandler(async (req, res, next) => {
  const genres = await db.getGenres();

  res.render("genres", {
    title: "All Genres",
    navLinks: indexController.navLinks,
    genres: genres,
  });
});

const createGenreFormGet = asyncHandler(async (req, res, next) => {
  res.render("genre_form", {
    title: "Create Genre",
  });
});

const createGenreFormPost = [
  validateGenre,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);

    if (!errors.isEmpty()) {
      return res.status(400).render("genre_form", {
        title: "Create Genre",
        errors: errors.array(),
      });
    }

    const { name } = req.body;

    await db.insertGenre(name);
    res.redirect("/");
  }),
];

module.exports = {
  getGenres,
  createGenreFormGet,
  createGenreFormPost,
};
