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

const getDeveloperDetails = asyncHandler(async (req, res, next) => {
  const developer = await db.getDeveloperDetails(req.params.id);

  if (!developer) {
    const err = new Error("Developer not found!");
    err.status = 404;
    return next(err);
  }

  res.render("developer_detail", {
    title: "Developer detail",
    developer: developer,
  });
});

const getDeveloperCreateForm = asyncHandler(async (req, res, next) => {
  const publishers = await db.getPublishers();

  res.render("developer_form", {
    title: "Create Developer",
    publishers: publishers,
    developer: undefined,
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
        developer: undefined,
        publishers: publishers,
        errors: errors.array(),
      });
    }

    const { name, location, founded, closed, publisher } = req.body;
    try {
      await db.insertDeveloper(name, location, founded, closed, publisher);
      res.redirect("/");
    } catch (e) {
      return res.status(400).render("developer_form", {
        title: "Create Developer",
        developer: undefined,
        publishers: publishers,
        errors: [...[errors], { msg: e.detail }],
      });
    }
  }),
];

const getDeveloperDelete = asyncHandler(async (req, res, next) => {
  const developer = await db.getDeveloperDetails(req.params.id);

  const games = await db.getDeveloperGames(req.params.id);

  if (!developer) {
    const err = new Error("Developer not found!");
    err.status = 404;
    return next(err);
  }

  res.render("developer_delete", {
    title: "Delete Developer",
    developer: developer,
    games: games,
  });
});

const postDeveloperDelete = asyncHandler(async (req, res, next) => {
  const developer = await db.getDeveloperDetails(req.params.id);
  const games = await db.getDeveloperGames(req.params.id);

  if (games.length > 0) {
    res.render("developer_delete", {
      title: "Delete Developer",
      developer: developer,
      games: games,
    });

    return;
  }

  await db.deleteDeveloper(req.params.id);
  res.redirect("/");
});

const getDeveloperUpdate = asyncHandler(async (req, res, next) => {
  const developer = await db.getDeveloperDetails(req.params.id);
  const date = await db.getDeveloperFoundedDate(req.params.id);
  const publishers = await db.getPublishers();

  res.render("developer_form", {
    title: "Update Developer",
    developer: developer,
    publishers: publishers,
    date: Object.values(date).toString(),
  });
});

const postDeveloperUpdate = [
  validateDeveloper,
  asyncHandler(async (req, res, next) => {
    const developer = await db.getDeveloperDetails(req.params.id);
    const publishers = await db.getPublishers();
    const errors = validationResult(req);
    const date = await db.getDeveloperFoundedDate(req.params.id);

    if (!errors.isEmpty()) {
      return res.status(400).render("developer_form", {
        title: "Update Developer",
        developer: developer,
        publishers: publishers,
        date: date,
        errors: errors.array(),
      });
    }

    const { name, location, founded, closed, publisher } = req.body;

    try {
      await db.updateDeveloper(
        req.params.id,
        name,
        location,
        founded,
        closed,
        publisher
      );

      res.redirect("/");
    } catch (e) {
      console.log(e);
      return res.status(400).render("developer_form", {
        title: "Update Developer",
        developer: developer,
        publishers: publishers,
        date: Object.values(date).toString(),
        errors: [...[errors], { msg: e.detail }],
      });
    }
  }),
];
module.exports = {
  getDevelopers,
  getDeveloperDetails,
  getDeveloperCreateForm,
  postDeveloperCreateForm,
  getDeveloperDelete,
  postDeveloperDelete,
  getDeveloperUpdate,
  postDeveloperUpdate,
};
