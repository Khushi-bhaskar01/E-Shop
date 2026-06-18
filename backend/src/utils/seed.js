const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const products = require('./products');
const connectDB = require('../config/db');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Cart.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const adminUserDoc = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
    });

    await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    const createdUsers = [adminUserDoc];

    const adminUser = createdUsers[0]._id;

    const sampleProducts = products.map((product) => {
      return { ...product };
    });

    await Product.insertMany(sampleProducts);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
