var express = require("express");
const userController = require("../controllers/userController");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/sign-up", userController.signUpGet);
router.post("/sign-up", userController.signUpPost);

router.get("/log-in", userController.logInGet);
router.post("/log-in", userController.logInPost);

router.get("/join-club", userController.joinClubGet);
router.post("/join-club", userController.joinClubPost);

router.get("/log-out", userController.logOutGet);

module.exports = router;
