const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const cartRoutes = require('./routes/cartRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/cart', cartRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' })
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
