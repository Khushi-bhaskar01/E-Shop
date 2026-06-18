import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CartContext } from '../context/CartContext';
import api from '../services/api';

export default function CheckoutScreen({ navigation }) {
  const { cartTotal, clearCart, cartItems } = useContext(CartContext);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (!address || !city || !postalCode || !country) {
      Alert.alert('Error', 'Please fill in all shipping details');
      return;
    }

    setIsLoading(true);
    try {
      const orderData = {
        shippingAddress: {
          address,
          city,
          postalCode,
          country
        }
      };
      
      await api.post('/order', orderData);
      await clearCart();
      
      Alert.alert('Success', 'Order placed successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Root') }
      ]);
    } catch (error) {
        console.log("Status:", error.response?.status);
        console.log("Response:", error.response?.data);
        console.log("Message:", error.message);

        Alert.alert(
          "Error",
          JSON.stringify(error.response?.data || error.message)
        );
      }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
      <ScrollView className="p-6">
        <Text className="text-2xl font-bold text-gray-800 mb-6">Shipping Information</Text>

        <View className="space-y-4 mb-8">
          <TextInput
            className="bg-gray-100 p-4 rounded-xl text-gray-800"
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
          />
          <TextInput
            className="bg-gray-100 p-4 rounded-xl text-gray-800"
            placeholder="City"
            value={city}
            onChangeText={setCity}
          />
          <View className="flex-row space-x-4">
            <TextInput
              className="bg-gray-100 p-4 rounded-xl text-gray-800 flex-1"
              placeholder="Postal Code"
              value={postalCode}
              onChangeText={setPostalCode}
            />
            <TextInput
              className="bg-gray-100 p-4 rounded-xl text-gray-800 flex-1"
              placeholder="Country"
              value={country}
              onChangeText={setCountry}
            />
          </View>
        </View>

        <Text className="text-xl font-bold text-gray-800 mb-4">Order Summary</Text>
        <View className="bg-gray-50 p-4 rounded-xl mb-8">
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Items ({cartItems.length}):</Text>
            <Text className="font-bold">${cartTotal.toFixed(2)}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Shipping:</Text>
            <Text className="font-bold">Free</Text>
          </View>
          <View className="h-px bg-gray-200 my-2" />
          <View className="flex-row justify-between">
            <Text className="text-lg font-bold text-gray-800">Total:</Text>
            <Text className="text-lg font-bold text-sky-600">${cartTotal.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      <View className="p-4 border-t border-gray-100 bg-white">
        <TouchableOpacity 
          className={`bg-sky-600 py-4 rounded-xl items-center ${isLoading ? 'opacity-70' : ''}`}
          onPress={handlePlaceOrder}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Place Order</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
