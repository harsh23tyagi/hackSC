const express = require("express");
const router = express.Router();
router.post("/test", (req, res) => {
  res.json({
    msg: "Posts Route works"
  });
});

module.exports = router;
