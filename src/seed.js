require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("./models/Product");
const User = require("./models/User");
const connectDb = require("./db");

const products = [
  {
    name: "Wireless Mouse",
    description: "Compact Bluetooth mouse",
    category: "Electronics",
    price: 799,
    stock: 40,
    brand: "Logi",
  },
  {
    name: "Mechanical Keyboard",
    description: "RGB backlit keyboard",
    category: "Electronics",
    price: 3499,
    stock: 18,
    brand: "Keychron",
  },
  {
    name: "Cotton T-Shirt",
    description: "Plain crew neck tee",
    category: "Clothing",
    price: 499,
    stock: 80,
    brand: "BasicWear",
  },
  {
    name: "Running Shoes",
    description: "Lightweight everyday trainers",
    category: "Clothing",
    price: 2499,
    stock: 25,
    brand: "Sprint",
  },
  {
    name: "Notebook Set",
    description: "Pack of 3 ruled notebooks",
    category: "Stationery",
    price: 199,
    stock: 120,
    brand: "NoteIt",
  },
  {
    name: "Ballpoint Pens",
    description: "Blue ink, pack of 10",
    category: "Stationery",
    price: 89,
    stock: 200,
    brand: "WriteWell",
  },
];

async function seedData() {
  await Product.deleteMany({});
  await User.deleteMany({});
  await Product.insertMany(products);
  await User.create({
    name: "Admin",
    email: "admin@example.com",
    password: "admin123",
  });
  console.log("Seeded 6 products and admin@example.com / admin123");
}

async function seedIfEmpty() {
  const count = await Product.countDocuments();
  if (count === 0) await seedData();
}

async function seed() {
  await connectDb();
  await seedData();
  await mongoose.disconnect();
}

if (require.main === module) {
  seed().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { seedIfEmpty, seedData };
