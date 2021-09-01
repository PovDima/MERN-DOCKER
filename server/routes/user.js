const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
  const user = (req.user && req.user.hidePassword()) || null;
  await res.status(200).send({ message: "User info successfully retreived", user });
});

module.exports = router;
