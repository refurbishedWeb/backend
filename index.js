const express = require('express');
const app = express();

const userRoute = require("./routes/User");
const productRoute = require("./routes/Product");
const orderRoute = require("./routes/Order");

app.get('/api/products', (req, res) => {
  res.json([]);
});

app.post('/api/order', (req, res) => {
  res.json({ success: true });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
