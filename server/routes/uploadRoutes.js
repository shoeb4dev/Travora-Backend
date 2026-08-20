const express = require("express");

const {
  uploadToCloudinary,
} = require("../controllers/uploadController");

const protect = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  upload.single("file"),
  uploadToCloudinary
);

module.exports = router;