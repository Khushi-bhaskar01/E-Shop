# E-Shop Full-Stack Mobile Application

A complete E-Commerce mobile application built using React Native (Expo) for the frontend and Node.js/Express for the backend.

## Features
- **Authentication**: JWT-based secure authentication (Login, Register).
- **Product Catalog**: View all products, search functionality, and category filtering.
- **Product Details**: View product images, descriptions, stock status, ratings, and price.
- **Shopping Cart**: Add, update, remove items. Dynamic total calculation.
- **Checkout**: Enter shipping address and place orders.
- **User Profile**: View user information and order history.

## Technology Stack
- **Frontend**: React Native, Expo, React Navigation, Axios, AsyncStorage, NativeWind (Tailwind CSS).
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs.

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB installed locally or an Atlas connection string
- Expo Go app on your physical device, or iOS/Android emulator

### Backend Setup
1. Open terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure your MongoDB is running locally on `mongodb://localhost:27017/ecommerce` (as configured in `.env`).
4. Seed the database with dummy data:
   ```bash
   npm run seed
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Expo app:
   ```bash
   npm start
   ```
4. Press `a` to open in Android Emulator, `i` to open in iOS Simulator, or scan the QR code with your Expo Go app.

> **Note on Android Emulator**: If you are using an Android emulator and cannot connect to the local backend, you may need to change `API_URL` in `src/services/api.js` from `http://localhost:5000/api` to `http://10.0.2.2:5000/api`.
