var express = require("express");
const userController = require("../controllers/userController");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/sign-up", userController.signUpGet);
router.post("/sign-up", userController.signUpPost);

module.exports = router;
