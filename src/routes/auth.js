const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const { register, login } = require("../controllers/authController");

const router = express.Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("name is required").isLength({ max: 80 }),
    body("email").isEmail().withMessage("valid email is required").normalizeEmail(),
    body("password")
      .isLength({ min: 6 })
      .withMessage("password must be at least 6 characters"),
  ],
  validate,
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("valid email is required").normalizeEmail(),
    body("password").notEmpty().withMessage("password is required"),
  ],
  validate,
  login
);

module.exports = router;
