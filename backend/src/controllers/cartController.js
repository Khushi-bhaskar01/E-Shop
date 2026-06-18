const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id }).populate('products.productId');
    
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, products: [] });
    } else {
      const validProducts = cart.products.filter(item => item.productId != null);
      if (validProducts.length !== cart.products.length) {
        cart.products = validProducts;
        await cart.save();
      }
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, products: [] });
    }

    const itemIndex = cart.products.findIndex(p => p.productId && p.productId.toString() === productId);

    if (itemIndex > -1) {
      // product exists in the cart, update the quantity
      cart.products[itemIndex].quantity += quantity;
    } else {
      // product does not exist in cart, add new item
      cart.products.push({ productId, quantity });
    }

    await cart.save();
    
    const populatedCart = await Cart.findById(cart._id).populate('products.productId');
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart
// @access  Private
const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.products.findIndex(p => p.productId && p.productId.toString() === productId);

    if (itemIndex > -1) {
      cart.products[itemIndex].quantity = quantity;
      await cart.save();
      const populatedCart = await Cart.findById(cart._id).populate('products.productId');
      res.json(populatedCart);
    } else {
      res.status(404).json({ message: 'Product not in cart' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.products = cart.products.filter(p => p.productId && p.productId.toString() !== req.params.productId);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('products.productId');
    res.json(populatedCart);
  } catch (error) {
    console.error("removeFromCart error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });

    if (cart) {
      cart.products = [];
      await cart.save();
    }
    
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
