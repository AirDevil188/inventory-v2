const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const db = require("../db/queries");

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
    publishers: publishers,
  });
});

const getCreatePublisherForm = asyncHandler(async (req, res, next) => {
  res.render("publisher_form", {
    title: "Create Publisher",
  });
});

const postCreatePublisherForm = [
  validatePublisher,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("publisher_form", {
        title: "Create Publisher",

        errors: errors.array(),
      });
    }
    const { name, location, founded, closed } = req.body;

    console.log(name, location, founded, closed);
    await db.insertPublisher(name, location, founded, closed);
    res.redirect("/");
  }),
];

const getPublisherDetails = asyncHandler(async (req, res, next) => {
  const publisher = await db.getPublisherDetails(req.params.id);

  if (!publisher) {
    const err = new Error("Publisher not found!");
    err.status = 404;
    return next(err);
  }
  console.log(publisher);

  res.render("publisher_detail", {
    title: "Publisher Details",
    publisher: publisher,
  });
});

module.exports = {
  getPublishers,
  getPublisherDetails,
  getCreatePublisherForm,
  postCreatePublisherForm,
};
