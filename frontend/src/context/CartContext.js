import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { userInfo } = useContext(AuthContext);

  const fetchCart = async () => {
    if (!userInfo) return;
    setIsLoading(true);
    try {
      const { data } = await api.get('/cart');
      setCartItems(data.products || []);
      calculateTotal(data.products || []);
    } catch (error) {
      console.error('Fetch cart error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    setIsLoading(true);
    try {
      const { data } = await api.post('/cart', { productId, quantity });
      setCartItems(data.products);
      calculateTotal(data.products);
    } catch (error) {
      console.error('Add to cart error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    setIsLoading(true);
    try {
      const { data } = await api.put('/cart', { productId, quantity });
      setCartItems(data.products);
      calculateTotal(data.products);
    } catch (error) {
      console.error('Update quantity error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    setIsLoading(true);
    try {
      const { data } = await api.delete(`/cart/${productId}`);
      setCartItems(data.products);
      calculateTotal(data.products);
    } catch (error) {
      console.error('Remove from cart error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    setIsLoading(true);
    try {
      await api.delete('/cart');
      setCartItems([]);
      setCartTotal(0);
    } catch (error) {
      console.error('Clear cart error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = (products) => {
    const total = products.reduce((acc, item) => {
      // product might be populated or just ID depending on API design, ensure it handles both
      const price = item.productId?.price || 0;
      return acc + price * item.quantity;
    }, 0);
    setCartTotal(total);
  };

  useEffect(() => {
    if (userInfo) {
      fetchCart();
    } else {
      setCartItems([]);
      setCartTotal(0);
    }
  }, [userInfo]);

  return (
    <CartContext.Provider value={{ cartItems, cartTotal, isLoading, fetchCart, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
