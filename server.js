const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5050; // ✅ use 5050 instead of 5000 to avoid conflicts

app.use(cors());
app.use(express.json());

// Path to products.json
const productsFile = path.join(__dirname, "products.json");

// Create products.json if it doesn’t exist
if (!fs.existsSync(productsFile)) {
  fs.writeFileSync(
    productsFile,
    JSON.stringify([
      {
        name: "Potato",
        price: 30,
        seller: "Abhishek",
        location: "Delhi",
        image: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Patates.jpg",
        type: "vegetable"
      },
      {
        name: "Tomato",
        price: 25,
        seller: "Aditi",
        location: "Mumbai",
        image: "https://upload.wikimedia.org/wikipedia/commons/8/88/Bright_red_tomato_and_cross_section02.jpg",
        type: "vegetable"
      },
      {
        name: "Apple",
        price: 120,
        seller: "Deepa",
        location: "Shimla",
        image: "https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg",
        type: "fruit"
      },
      {
        name: "Mango",
        price: 150,
        seller: "Ravi",
        location: "Mumbai",
        image: "https://upload.wikimedia.org/wikipedia/commons/9/90/Hapus_Mango.jpg",
        type: "fruit"
      }
    ], null, 2),
    "utf-8"
  );
}

// GET products
app.get("/api/products", (req, res) => {
  fs.readFile(productsFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Cannot read file" });
    res.json(JSON.parse(data));
  });
});

// POST new product
app.post("/api/products", (req, res) => {
  fs.readFile(productsFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Cannot read file" });
    const products = JSON.parse(data);
    products.push(req.body);
    fs.writeFile(productsFile, JSON.stringify(products, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Cannot save" });
      res.json({ message: "✅ Product added", product: req.body });
    });
  });
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
