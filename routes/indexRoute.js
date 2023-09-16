var express = require("express");
const messageController = require("../controllers/messageController");
var router = express.Router();

/* GET home page. */
router.get("/", messageController.messageBoardGet);

router.post("/new-message", messageController.newMessagePost);

router.post("/delete-message", messageController.deleteMessagePost);

module.exports = router;
