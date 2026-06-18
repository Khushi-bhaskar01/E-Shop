const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getCart).post(protect, addToCart).put(protect, updateCartItem).delete(protect, clearCart);
router.route('/:productId').delete(protect, removeFromCart);

module.exports = router;
