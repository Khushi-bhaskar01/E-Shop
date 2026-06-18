import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../services/api';

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = ['Electronics', 'Fashion', 'Shoes', 'Home Decor', 'Accessories'];
  const featuredProducts = products.slice(0, 5);
  const trendingProducts = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 5);
  const specialOffers = products.filter((product) => product.price < 100).slice(0, 5);

  const renderProductRail = (items) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 mb-8">
      {items.map((product) => (
        <TouchableOpacity
          key={product._id}
          className="bg-white rounded-2xl p-4 mx-2 shadow-sm border border-gray-100 w-48"
          onPress={() => navigation.navigate('ProductDetails', { id: product._id })}
        >
          <Image source={{ uri: product.image }} className="w-full h-40 rounded-xl mb-3" resizeMode="cover" />
          <Text className="text-gray-800 font-bold mb-1" numberOfLines={1}>
            {product.title}
          </Text>
          <Text className="text-gray-500 text-xs mb-2">{product.category}</Text>
          <View className="flex-row justify-between items-center">
            <Text className="text-sky-600 font-bold text-lg">${product.price}</Text>
            <Text className="text-yellow-500 text-xs">Rating {product.rating}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-4 bg-white flex-row justify-between items-center shadow-sm">
          <Text className="text-2xl font-bold text-sky-600">E-Shop</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
            <Text className="text-sky-600 font-bold">Cart</Text>
          </TouchableOpacity>
        </View>

        <View className="m-6 rounded-2xl overflow-hidden bg-sky-500 p-6 flex-row items-center shadow-md">
          <View className="flex-1">
            <Text className="text-white text-2xl font-bold mb-2">Summer Sale</Text>
            <Text className="text-sky-100 mb-4">Up to 50% off on curated essentials</Text>
            <TouchableOpacity className="bg-white px-4 py-2 rounded-full self-start" onPress={() => navigation.navigate('Products')}>
              <Text className="text-sky-600 font-bold">Shop Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mb-6">
          <View className="px-6 mb-4 flex-row justify-between items-end">
            <Text className="text-xl font-bold text-gray-800">Categories</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Products')}>
              <Text className="text-sky-600 font-medium">See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                className="bg-white px-6 py-3 mx-2 rounded-full shadow-sm border border-gray-100"
                onPress={() => navigation.navigate('Products', { category })}
              >
                <Text className="text-gray-800 font-medium">{category}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0ea5e9" className="mt-10" />
        ) : (
          <>
            <View className="px-6 mb-4 flex-row justify-between items-end">
              <Text className="text-xl font-bold text-gray-800">Featured Products</Text>
            </View>
            {renderProductRail(featuredProducts)}

            <View className="px-6 mb-4 flex-row justify-between items-end">
              <Text className="text-xl font-bold text-gray-800">Trending Products</Text>
            </View>
            {renderProductRail(trendingProducts)}

            <View className="mx-6 mb-6 rounded-2xl bg-gray-900 p-5">
              <Text className="text-white text-xl font-bold mb-1">Special Offers</Text>
              <Text className="text-gray-300 mb-4">Curated picks under $100 for quick gifting.</Text>
              <TouchableOpacity className="bg-sky-500 px-4 py-2 rounded-full self-start" onPress={() => navigation.navigate('Products')}>
                <Text className="text-white font-bold">Explore Deals</Text>
              </TouchableOpacity>
            </View>
            {specialOffers.length > 0 ? renderProductRail(specialOffers) : null}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
