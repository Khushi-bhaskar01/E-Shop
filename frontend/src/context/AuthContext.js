import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [splashLoading, setSplashLoading] = useState(true);

  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      const { data } = await api.post('/register', { name, email, password });
      setUserInfo(data);
      await AsyncStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
      console.error(`Register error: ${error}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const { data } = await api.post('/login', { email, password });
      setUserInfo(data);
      await AsyncStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
      console.error(`Login error: ${error}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem('userInfo');
      setUserInfo(null);
    } catch (error) {
      console.error(`Logout error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const isLoggedIn = async () => {
    try {
      setSplashLoading(true);
      
      // Add a minimum delay so the Splash Screen animation is visible
      // Increased to 4000ms as requested for video recording
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      let userInfoStr = await AsyncStorage.getItem('userInfo');
      if (userInfoStr) {
        setUserInfo(JSON.parse(userInfoStr));
      }
    } catch (error) {
      console.error(`isLoggedIn error: ${error}`);
    } finally {
      setSplashLoading(false);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoading, userInfo, splashLoading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
