const asyncHandler = require("express-async-handler");
const Message = require("../models/message");
const { bodyRequired } = require("./controllerHelper");
const { validationResult } = require("express-validator");
const User = require("../models/user");

exports.messageBoardGet = asyncHandler(async (req, res, next) => {
  const messages = await Message.find()
    .sort({ createdAt: "desc" })
    .populate("creator");
  res.render("index", { title: "Private Clubhouse", messages: messages });
});

exports.newMessagePost = [
  bodyRequired("message", "Message"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const message = new Message({
      content: req.body.message,
      creator: req.user._id,
    });

    if (!errors.isEmpty()) {
      res.render("index", {
        title: "Private Clubhouse",
        message: message,
        errors: errors.array().map((e) => e.msg),
      });
      return;
    }

    await message.save();

    res.redirect("/");
  }),
];

exports.deleteMessagePost = [
  bodyRequired("messageid", "Message ID"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req)
      .array()
      .map((e) => e.msg);

    const user = await User.findById(req.user._id);

    if (!user || !user.isAdmin) {
      errors.push("Unauthorized request");
    }

    const message = await Message.findById(req.body.messageid);

    if (!message) {
      errors.push("Message not found");
    }

    if (errors.length > 0) {
      res.render("index", {
        title: "Private Clubhouse",
        errors: errors.array().map((e) => e.msg),
      });
      return;
    }

    await message.deleteOne();

    res.redirect("/");
  }),
];
