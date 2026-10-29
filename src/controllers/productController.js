const Product = require("../models/Product");

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function listProducts(req, res, next) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const match = {};
    if (req.query.name) {
      match.name = { $regex: escapeRegex(req.query.name), $options: "i" };
    }
    if (req.query.category) {
      match.category = { $regex: escapeRegex(req.query.category), $options: "i" };
    }
    if (req.query.minPrice != null || req.query.maxPrice != null) {
      match.price = {};
      if (req.query.minPrice != null) match.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice != null) match.price.$lte = Number(req.query.maxPrice);
    }

    const [result] = await Product.aggregate([
      { $match: match },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          metadata: [{ $count: "total" }],
        },
      },
    ]);

    const total = result.metadata[0]?.total || 0;
    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 0,
      products: result.data,
    });
  } catch (err) {
    next(err);
  }
}

async function getProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    next(err);
  }
}

async function createProduct(req, res, next) {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    next(err);
  }
}

async function productStats(req, res, next) {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
          totalStock: { $sum: "$stock" },
        },
      },
      { $sort: { count: -1 } },
      {
        $project: {
          _id: 0,
          category: "$_id",
          count: 1,
          avgPrice: { $round: ["$avgPrice", 2] },
          minPrice: 1,
          maxPrice: 1,
          totalStock: 1,
        },
      },
    ]);

    res.json({ stats });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  productStats,
};
