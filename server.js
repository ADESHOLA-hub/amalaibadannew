const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Use built-in JSON parser middleware instead of body-parser
app.use(cors());
app.use(express.json());               // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

let orders = {}; // In-memory store

app.post('/submit-order', (req, res) => {
  const order = req.body;
  const orderId = 'order_' + Date.now();
  orders[orderId] = order;
  res.json({ success: true, orderId });
});

app.get('/order/:orderId', (req, res) => {
  const { orderId } = req.params;
  const order = orders[orderId];
  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
