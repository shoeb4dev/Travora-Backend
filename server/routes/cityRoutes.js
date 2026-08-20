const express = require("express");

const {
  createCity,
  getCities,
  getCitiesByCountry,
  getCityById,
  updateCity,
  deleteCity,
} = require("../controllers/cityController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/", protect, admin, createCity);

router.get("/", getCities);

router.get("/country/:countryId", getCitiesByCountry);

router.get("/:id", getCityById);

router.put("/:id", protect, admin, updateCity);

router.delete("/:id", protect, admin, deleteCity);

module.exports = router;