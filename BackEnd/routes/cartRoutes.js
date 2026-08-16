const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { getCart, addToCart, updateCartItem, removeFromCart } = require('../controllers/cartController');

// All cart routes require authentication
router.use(verifyToken);

router.get('/', getCart);
router.post('/', addToCart);
router.put('/:bookId', updateCartItem);
router.delete('/:bookId', removeFromCart);

module.exports = router;
