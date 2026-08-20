const express = require("express");

const {
  createPlaylist,
  getMyPlaylists,
  getPublicPlaylist,
  addAttractionToPlaylist,
  removeAttractionFromPlaylist,
  updatePlaylist,
  deletePlaylist,
} = require("../controllers/playlistController");

const protect = require("../middleware/authMiddleware");


const router = express.Router();


// Create playlist
router.post("/", protect, createPlaylist);

// Get my playlists
router.get("/my", protect, getMyPlaylists);

// Get public playlist
router.get("/public/:id", getPublicPlaylist);

// Add attraction
router.post(
  "/:playlistId/attractions/:attractionId",
  protect,
  addAttractionToPlaylist
);

// Remove attraction
router.delete(
  "/:playlistId/attractions/:attractionId",
  protect,
  removeAttractionFromPlaylist
);

// Update playlist
router.put("/:id", protect, updatePlaylist);

// Delete playlist
router.delete("/:id", protect, deletePlaylist);

module.exports = router;