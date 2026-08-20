const express = require("express");

const {
  toggleLike,
  getReelLikes,
} = require("../controllers/likeController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:reelId", protect, toggleLike);

router.get("/:reelId", getReelLikes);

module.exports = router;