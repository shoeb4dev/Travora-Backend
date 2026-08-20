const express = require("express");

const {
  createCountry,
  getCountries,
  getCountryById,
  updateCountry,
  deleteCountry,
} = require("../controllers/countryController");

const protect = require("../middleware/authMiddleware")
const admin = require("../middleware/adminMiddleware");;

const router = express.Router();

router.post("/", protect, admin, createCountry);

router.get("/", getCountries);

router.get("/:id", getCountryById);

router.put("/:id", protect,admin, updateCountry);

router.delete("/:id", protect,admin, deleteCountry);

module.exports = router;