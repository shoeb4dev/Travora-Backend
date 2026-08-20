const express = require("express");

const {
  registerUser,
  loginUser,
  getProfile,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validationMiddleware");

const router = express.Router();
const {  registerSchema,  loginSchema,} = require("../validations/authValidation");
router.post("/register", validate(registerSchema), registerUser);

router.post("/login", validate(loginSchema), loginUser);

router.get("/profile", protect, getProfile);

module.exports = router;