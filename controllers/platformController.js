const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const db = require("../db/queries");
const indexController = require("../controllers/indexController");

const lengthErr = "must contain at least one character.";

const validatePlatform = [
  body("name").trim().isLength({ min: 1 }).withMessage(`Name ${lengthErr}`),
];

const getPlatforms = asyncHandler(async (req, res, next) => {
  const platforms = await db.getPlatforms();

  res.render("platforms", {
    title: "All Platforms",
    navLinks: indexController.navLinks,
    platforms: platforms,
  });
});

const getCreatePlatformForm = asyncHandler(async (req, res, next) => {
  res.render("platform_form", {
    title: "Create Platform",
    navLinks: indexController.navLinks,
  });
});

const postCreatePlatformForm = [
  validatePlatform,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);

    if (!errors.isEmpty()) {
      return res.status(400).render("platform_form", {
        title: "Create Platform",
        navLinks: indexController.navLinks,
        errors: errors.array(),
      });
    }

    const { name } = req.body;
    await db.insertPlatform(name);

    res.redirect("/");
  }),
];
module.exports = {
  getPlatforms,
  getCreatePlatformForm,
  postCreatePlatformForm,
};
