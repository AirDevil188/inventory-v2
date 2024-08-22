const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const db = require("../db/queries");

const lengthErr = "must contain at least one character.";
const selectionErr = "must be selected.";

const validateDeveloper = [
  body("name").trim().isLength({ min: 1 }).withMessage(`Name ${lengthErr}`),
  body("location")
    .trim()
    .isLength({ min: 1 })
    .withMessage(`Location ${lengthErr}`),
  body("founded").trim().notEmpty().withMessage(`Date ${selectionErr}`),
  body("closed")
    .trim()
    .notEmpty()
    .withMessage(`Status of developer ${selectionErr}`),
];

const getDevelopers = asyncHandler(async (req, res, next) => {
  const developers = await db.getDevelopers();

  res.render("developers", {
    title: "All Developers",
    developers: developers,
  });
});

const getDeveloperCreateForm = asyncHandler(async (req, res, next) => {
  const publishers = await db.getPublishers();

  res.render("developer_form", {
    title: "Create Developer",
    publishers: publishers,
  });
});

const postDeveloperCreateForm = [
  validateDeveloper,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const publishers = await db.getPublishers();

    if (!errors.isEmpty()) {
      return res.status(400).render("developer_form", {
        title: "Create Developer",
        publishers: publishers,
        errors: errors.array(),
      });
    }

    const { name, location, founded, closed, publisher } = req.body;
    console.log(closed);
    await db.insertDeveloper(name, location, founded, closed, publisher);

    res.redirect("/");
  }),
];
module.exports = {
  getDevelopers,
  getDeveloperCreateForm,
  postDeveloperCreateForm,
};
