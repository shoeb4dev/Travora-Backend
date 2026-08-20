const express = require("express");

const {
  createReel,
  getReels,
  getReelsByAttraction,
  getReelById,
  updateReel,
  deleteReel,
} = require("../controllers/reelController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getReels);

router.get("/attraction/:attractionId", getReelsByAttraction);

router.get("/:id", getReelById);

router.post("/", protect, createReel);

router.put("/:id", protect, updateReel);

router.delete("/:id", protect, deleteReel);

module.exports = router;