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
    publisher: undefined,
  });
});

const postCreatePublisherForm = [
  validatePublisher,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("publisher_form", {
        title: "Create Publisher",
        publisher: undefined,
        errors: errors.array(),
      });
    }
    const { name, location, founded, closed } = req.body;

    try {
      await db.insertPublisher(name, location, founded, closed);
      res.redirect("/");
    } catch (e) {
      console.log(e);
      return res.status(400).render("publisher_form", {
        title: "Create Publisher",
        publisher: undefined,
        errors: [...[errors], { msg: e.detail }],
      });
    }
  }),
];

const getPublisherDetails = asyncHandler(async (req, res, next) => {
  const publisher = await db.getPublisherDetails(req.params.id);

  if (!publisher) {
    const err = new Error("Publisher not found!");
    err.status = 404;
    return next(err);
  }

  res.render("publisher_detail", {
    title: "Publisher Details",
    publisher: publisher,
  });
});

const getPublisherDelete = asyncHandler(async (req, res, next) => {
  const publisher = await db.getPublisherDetails(req.params.id);
  const developers = await db.getPublisherDevelopers(req.params.id);
  const games = await db.getPublisherGames(req.params.id);

  if (!publisher) {
    const err = new Error("Publisher not found!");
    err.status = 404;
    return next(err);
  }

  res.render("publisher_delete", {
    title: "Delete Publisher",
    publisher: publisher,
    developers: developers,
    games: games,
  });
});

const postPublisherDelete = asyncHandler(async (req, res, next) => {
  const publisher = await db.getPublisherDetails(req.params.id);
  const developers = await db.getPublisherDevelopers(req.params.id);
  const games = await db.getPublisherGames(req.params.id);

  if (developers.length > 0 || games.length > 0) {
    res.render("publisher_delete", {
      title: "Delete Publisher",
      publisher: publisher,
      developers: developers,
      games: games,
    });
    return;
  }

  await db.deletePublisher(req.params.id);
  res.redirect("/");
});

const getPublisherUpdate = asyncHandler(async (req, res, next) => {
  const publisher = await db.getPublisherDetails(req.params.id);
  const date = await db.getPublisherFoundedDate(req.params.id);

  res.render("publisher_form", {
    title: "Update Publisher",
    publisher: publisher,
    date: Object.values(date).toString(),
  });
});

const postPublisherUpdate = [
  validatePublisher,
  asyncHandler(async (req, res, next) => {
    const publisher = await db.getPublisherDetails(req.params.id);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("publisher_form", {
        title: "Update Publisher",
        publisher: publisher,
        errors: errors.array(),
      });
    }
    const { name, location, founded, closed } = req.body;
    await db.updatePublisher(req.params.id, name, location, founded, closed);
    res.redirect("/");
  }),
];

module.exports = {
  getPublishers,
  getPublisherDetails,
  getCreatePublisherForm,
  postCreatePublisherForm,
  getPublisherDelete,
  postPublisherDelete,
  getPublisherUpdate,
  postPublisherUpdate,
};
