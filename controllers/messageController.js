const asyncHandler = require("express-async-handler");
const Message = require("../models/message");
const { bodyRequired } = require("./controllerHelper");
const { validationResult } = require("express-validator");

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
