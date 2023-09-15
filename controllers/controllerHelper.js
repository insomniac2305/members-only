const { body } = require("express-validator");

exports.bodyRequired = (field, fieldName) =>
  body(field)
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage(`${fieldName} must be specified`);
