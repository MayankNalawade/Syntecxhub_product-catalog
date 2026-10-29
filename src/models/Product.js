const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 1000, default: "" },
    category: { type: String, required: true, trim: true, maxlength: 60 },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    brand: { type: String, trim: true, maxlength: 80, default: "" },
  },
  { timestamps: true }
);

productSchema.index({ name: 1, category: 1 });

module.exports = mongoose.model("Product", productSchema);
