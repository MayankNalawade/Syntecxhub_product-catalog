const express = require("express");
const { body, param, query } = require("express-validator");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  productStats,
} = require("../controllers/productController");

const router = express.Router();

const productBody = [
  body("name").trim().notEmpty().withMessage("name is required").isLength({ max: 120 }),
  body("description").optional().trim().isLength({ max: 1000 }),
  body("category").trim().notEmpty().withMessage("category is required").isLength({ max: 60 }),
  body("price").isFloat({ min: 0 }).withMessage("price must be a number >= 0").toFloat(),
  body("stock").optional().isInt({ min: 0 }).withMessage("stock must be an integer >= 0").toInt(),
  body("brand").optional().trim().isLength({ max: 80 }),
];

router.get(
  "/",
  [
    query("name").optional().trim().isLength({ max: 120 }),
    query("category").optional().trim().isLength({ max: 60 }),
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1, max: 50 }).toInt(),
    query("minPrice").optional().isFloat({ min: 0 }).toFloat(),
    query("maxPrice").optional().isFloat({ min: 0 }).toFloat(),
  ],
  validate,
  listProducts
);

router.get("/stats", productStats);

router.get(
  "/:id",
  [param("id").isMongoId().withMessage("invalid product id")],
  validate,
  getProduct
);

router.post("/", auth, productBody, validate, createProduct);

router.put(
  "/:id",
  auth,
  [param("id").isMongoId().withMessage("invalid product id"), ...productBody],
  validate,
  updateProduct
);

router.delete(
  "/:id",
  auth,
  [param("id").isMongoId().withMessage("invalid product id")],
  validate,
  deleteProduct
);

module.exports = router;
