const express = require("express");

const {
  createComment,
  getReelComments,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Create comment
router.post("/reel/:reelId", protect, createComment);

// Get comments
router.get("/reel/:reelId", getReelComments);

// Update comment
router.put("/:commentId", protect, updateComment);

// Delete comment
router.delete("/:commentId", protect, deleteComment);

module.exports = router;