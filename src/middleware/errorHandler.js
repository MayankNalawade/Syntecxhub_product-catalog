function errorHandler(err, _req, res, _next) {
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid id" });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    return res.status(409).json({ message: `${field} already exists` });
  }

  console.error(err);
  res.status(500).json({ message: "Internal server error" });
}

module.exports = errorHandler;
