import React, { useContext } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CartContext } from '../context/CartContext';

export default function CartScreen({ navigation }) {
  const { cartItems, cartTotal, isLoading, updateQuantity, removeFromCart } = useContext(CartContext);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#0ea5e9" />
      </SafeAreaView>
    );
  }

  if (cartItems.length === 0) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-50 px-6">
        <Text className="text-2xl text-gray-400 mb-4">Cart</Text>
        <Text className="text-xl font-bold text-gray-800 mb-2">Your Cart is Empty</Text>
        <Text className="text-gray-500 mb-6 text-center">Looks like you have not added anything yet.</Text>
        <TouchableOpacity className="bg-sky-600 px-6 py-3 rounded-full" onPress={() => navigation.navigate('Products')}>
          <Text className="text-white font-bold text-lg">Start Shopping</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }) => (
    <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100 flex-row items-center">
      <Image source={{ uri: item.productId.image }} className="w-20 h-20 rounded-xl mr-4 bg-gray-100" resizeMode="cover" />
      <View className="flex-1">
        <Text className="text-gray-800 font-bold mb-1" numberOfLines={1}>{item.productId.title}</Text>
        <Text className="text-sky-600 font-bold mb-2">${item.productId.price}</Text>

        <View className="flex-row items-center">
          <TouchableOpacity
            className="bg-gray-100 w-8 h-8 rounded-full justify-center items-center"
            onPress={() => updateQuantity(item.productId._id, Math.max(1, item.quantity - 1))}
          >
            <Text className="font-bold text-gray-600">-</Text>
          </TouchableOpacity>

          <Text className="mx-4 font-bold">{item.quantity}</Text>

          <TouchableOpacity
            className="bg-gray-100 w-8 h-8 rounded-full justify-center items-center"
            onPress={() => updateQuantity(item.productId._id, item.quantity + 1)}
          >
            <Text className="font-bold text-gray-600">+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity className="p-2" onPress={() => removeFromCart(item.productId._id)}>
        <Text className="text-red-500 font-bold">Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 py-4 bg-white shadow-sm">
        <Text className="text-2xl font-bold text-gray-800">Shopping Cart</Text>
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.productId._id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />

      <View className="p-6 bg-white border-t border-gray-100">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-gray-500 text-lg">Total Amount:</Text>
          <Text className="text-2xl font-bold text-sky-600">${cartTotal.toFixed(2)}</Text>
        </View>
        <TouchableOpacity className="bg-sky-600 py-4 rounded-xl items-center" onPress={() => navigation.navigate('Checkout')}>
          <Text className="text-white font-bold text-lg">Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
