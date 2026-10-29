require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const connectDb = require("./db");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

connectDb()
  .then(async () => {
    if (process.env.USE_MEMORY_DB === "true") {
      const { seedIfEmpty } = require("./seed");
      await seedIfEmpty();
    }
    app.listen(port, () => {
      console.log(`API running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start:", err.message);
    process.exit(1);
  });
