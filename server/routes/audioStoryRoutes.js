const express = require("express");

const {
  createAudioStory,
  getAudioStories,
  getAudioStoriesByAttraction,
  getAudioStoryById,
  updateAudioStory,
  deleteAudioStory,
} = require("../controllers/audioStoryController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

// Public
router.get("/", getAudioStories);

router.get(
  "/attraction/:attractionId",
  getAudioStoriesByAttraction
);

router.get("/:id", getAudioStoryById);

// Protected
router.post("/", protect, admin, createAudioStory);

router.put("/:id", protect, admin, updateAudioStory);

router.delete("/:id", protect, admin, deleteAudioStory);

module.exports = router;