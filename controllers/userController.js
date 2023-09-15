const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/user");
const passport = require("passport");
const { bodyRequired } = require("./controllerHelper");

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
        errors: errors.array().map((e) => e.msg),
      });
      return;
    }

    bcrypt.hash(req.body.password, 10, async (hashErr, hashedPassword) => {
      if (hashErr) {
        return next(hashErr);
      }
      user.password = hashedPassword;

      await user.save();

      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
      });

      res.redirect("/");
    });
  }),
];

exports.logInGet = (req, res, next) => {
  res.render("login", { title: "Log in" });
};

exports.logInPost = [
  bodyRequired("email", "E-mail")
    .isEmail()
    .withMessage("E-Mail must have valid format"),
  bodyRequired("password", "Password"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("login", {
        title: "Log in",
        user: { email: req.body.email },
        errors: errors.array().map((e) => e.msg),
      });
    } else {
      next();
    }
  },

  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/user/log-in",
    failureMessage: true,
  }),
];

exports.joinClubGet = (req, res, next) => {
  res.render("joinclub", { title: "Join club" });
};

exports.joinClubPost = [
  bodyRequired("secret", "Secret password")
    .custom((secret) => secret === process.env.CLUB_SECRET)
    .withMessage("The provided secret is incorrect"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const user = await User.findById(req.user._id);

    if (!errors.isEmpty() || !user) {
      res.render("joinclub", {
        title: "Join club",
        errors: errors.array().map((e) => e.msg),
      });
      return;
    }

    user.isMember = true;
    await user.save();

    res.redirect("/");
  }),
];

exports.logOutGet = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    res.redirect("/");
  });
};
