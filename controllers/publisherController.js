const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const db = require("../db/queries");
const indexController = require("../controllers/indexController");

const lengthErr = "must contain at least one character.";
const emptyErr = "must not be empty.";

const validatePublisher = [
  body("name").trim().isLength({ min: 1 }).withMessage(`Name ${lengthErr}`),
  body("location")
    .trim()
    .isLength({ min: 1 })
    .withMessage(`Location ${lengthErr}`),
  body("founded").trim().notEmpty().withMessage(`Date ${emptyErr}`),
];

const getPublishers = asyncHandler(async (req, res, next) => {
  const publishers = await db.getPublishers();

  res.render("publishers", {
    title: "All Publishers",
    navLinks: indexController.navLinks,
    publishers: publishers,
  });
});

const getCreatePublisherForm = asyncHandler(async (req, res, next) => {
  res.render("publisher_form", {
    title: "Create Publisher",
    navLinks: indexController.navLinks,
  });
});

const postCreatePublisherForm = [
  validatePublisher,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("publisher_form", {
        title: "Create Publisher",
        navLinks: indexController.navLinks,
        errors: errors.array(),
      });
    }
    const { name, location, founded, closed } = req.body;

    console.log(name, location, founded, closed);
    await db.insertPublisher(name, location, founded, closed);
    res.redirect("/");
  }),
];

module.exports = {
  getPublishers,
  getCreatePublisherForm,
  postCreatePublisherForm,
};
