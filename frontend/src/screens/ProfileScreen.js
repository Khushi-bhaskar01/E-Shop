import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

export default function ProfileScreen() {
  const { userInfo, logout } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/order');
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setLoading(false);
      }
    };
    if (userInfo) {
      fetchOrders();
    }
  }, [userInfo]);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 py-4 bg-white shadow-sm flex-row justify-between items-center">
        <Text className="text-2xl font-bold text-gray-800">Profile</Text>
        <TouchableOpacity onPress={handleLogout} className="bg-red-100 px-4 py-2 rounded-full">
          <Text className="text-red-600 font-bold">Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="p-6">
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 items-center">
          <View className="w-24 h-24 bg-sky-100 rounded-full items-center justify-center mb-4">
            <Text className="text-4xl text-sky-600 font-bold">{userInfo?.name?.charAt(0)}</Text>
          </View>
          <Text className="text-xl font-bold text-gray-800 mb-1">{userInfo?.name}</Text>
          <Text className="text-gray-500">{userInfo?.email}</Text>
        </View>

        <Text className="text-xl font-bold text-gray-800 mb-4">Order History</Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="#0ea5e9" />
        ) : orders.length === 0 ? (
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 items-center">
            <Text className="text-gray-500">You have not placed any orders yet.</Text>
          </View>
        ) : (
          orders.map((order) => (
            <View key={order._id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
              <View className="flex-row justify-between mb-2">
                <Text className="font-bold text-gray-800">Order #{order._id.substring(0, 8)}</Text>
                <Text className="text-sky-600 font-bold">${order.totalAmount.toFixed(2)}</Text>
              </View>
              <Text className="text-gray-500 mb-2">Date: {new Date(order.createdAt).toLocaleDateString()}</Text>
              <View className="flex-row items-center justify-between mt-2 pt-2 border-t border-gray-100">
                <Text className="text-gray-600">{order.products.length} items</Text>
                <Text className={`font-bold ${order.status === 'Processing' ? 'text-yellow-500' : 'text-green-500'}`}>
                  {order.status}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
