const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/user");

const bodyRequired = (field, fieldName) =>
  body(field)
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage(`${fieldName} must be specified`);

exports.signUpGet = (req, res, next) => {
  res.render("signup", { title: "Sign up" });
};

exports.signUpPost = [
  bodyRequired("firstname", "First name"),
  bodyRequired("lastname", "Last name"),

  bodyRequired("email", "E-mail")
    .isEmail()
    .withMessage("E-Mail must have valid format")
    .custom(async (email) => {
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        throw new Error("E-mail is already in use");
      }
    }),

  bodyRequired("password", "Password"),
  bodyRequired("confirm-password", "Password confirmation")
    .custom((confirmPassword, { req }) => confirmPassword === req.body.password)
    .withMessage("Passwords must match"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const user = new User({
      firstName: req.body.firstname,
      lastName: req.body.lastname,
      email: req.body.email,
    });

    if (!errors.isEmpty()) {
      res.render("signup", {
        title: "Sign up",
        user: user,
        errors: errors.array(),
      });
      return;
    }

    bcrypt.hash(req.body.password, 10, async (hashErr, hashedPassword) => {
      if (hashErr) {
        return next(hashErr);
      }
      user.password = hashedPassword;

      await user.save();

      res.redirect("/");
    });
  }),
];

exports.logInGet = (req, res, next) => {
  res.render("login", { title: "Log in" });
};

exports.logInPost = (req, res, next) => {
  res.render("login", { title: "Log in" });
};

exports.joinClubGet = (req, res, next) => {
  res.render("joinclub", { title: "Join club" });
};

exports.joinClubPost = [
  bodyRequired("secret", "Secret password")
    .custom((secret) => secret === process.env.CLUB_SECRET)
    .withMessage("The provided secret is incorrect"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const user = await User.findById(req.body.userid);

    if (!errors.isEmpty() || !user) {
      res.render("joinclub", {
        title: "Join club",
        errors: errors.array(),
      });
      return;
    }

    user.isMember = true;
    user.save();

    res.redirect("/");
  }),
];
