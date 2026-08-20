const express = require("express");

const {
  createAttraction,
  getAttractions,
  getAttractionsByCity,
  getAttractionById,
  updateAttraction,
  deleteAttraction,
    searchAttractions,
    getNearbyAttractions,
} = require("../controllers/attractionController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/", protect, admin, createAttraction);

router.get("/", getAttractions);

router.get("/search", searchAttractions);

router.get("/city/:cityId", getAttractionsByCity);

router.get("/nearby", getNearbyAttractions);

router.get("/:id", getAttractionById);

router.put("/:id", protect, admin, updateAttraction);

router.delete("/:id", protect, admin, deleteAttraction);

module.exports = router;