const express = require("express");
const router = express.Router();
const user = require("./user");
const auth = require("./auth");
const error = require("../middleware/error");

router.use("/user", user);
router.use("/auth", auth);
router.use(error);

module.exports = router;
