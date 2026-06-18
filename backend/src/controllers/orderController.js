const Order = require('../models/Order');
const Cart = require('../models/Cart');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  const { shippingAddress } = req.body;

  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate('products.productId');

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const validProducts = cart.products.filter(item => item.productId != null);

    if (validProducts.length === 0) {
      return res.status(400).json({ message: 'No valid products in cart' });
    }

    const orderProducts = validProducts.map(item => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price
    }));

    const totalAmount = orderProducts.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const order = new Order({
      userId: req.user._id,
      products: orderProducts,
      shippingAddress,
      totalAmount
    });

    const createdOrder = await order.save();

    // Clear cart after order is placed
    cart.products = [];
    await cart.save();

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).populate('products.productId');
    res.json(orders);
  } catch (error) {
      console.error("ORDER ERROR:", error);
      res.status(500).json({
        message: error.message,
        stack: error.stack
      });
    }
};

module.exports = { addOrderItems, getMyOrders };
