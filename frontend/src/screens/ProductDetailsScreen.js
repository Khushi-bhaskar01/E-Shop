import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CartContext } from '../context/CartContext';
import api from '../services/api';

export default function ProductDetailsScreen({ route, navigation }) {
  const { id } = route.params;
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, isLoading: cartLoading } = useContext(CartContext);
  const { width } = useWindowDimensions();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const [{ data: productData }, { data: allProducts }] = await Promise.all([
          api.get(`/products/${id}`),
          api.get('/products'),
        ]);

        setProduct(productData);
        setRelatedProducts(
          allProducts
            .filter((item) => item._id !== productData._id && item.category === productData.category)
            .slice(0, 5)
        );
      } catch (error) {
        console.error('Failed to fetch product', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await addToCart(product._id, 1);
      Alert.alert('Success', 'Added to cart');
    } catch (error) {
      Alert.alert('Error', 'Failed to add to cart');
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0ea5e9" />
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text>Product not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
      <ScrollView>
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
          {[product.image].map((image) => (
            <Image key={image} source={{ uri: image }} style={{ width }} className="h-80 bg-gray-100" resizeMode="cover" />
          ))}
        </ScrollView>

        <View className="p-6">
          <View className="flex-row justify-between items-start mb-2">
            <Text className="text-2xl font-bold text-gray-800 flex-1 mr-4">{product.title}</Text>
            <Text className="text-2xl font-bold text-sky-600">${product.price}</Text>
          </View>

          <View className="flex-row items-center mb-6">
            <Text className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-bold text-xs mr-2">
              Rating {product.rating}
            </Text>
            <Text className="text-gray-500 text-sm">Category: {product.category}</Text>
            <Text className={`ml-auto font-bold text-sm ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </Text>
          </View>

          <Text className="text-lg font-bold text-gray-800 mb-2">Description</Text>
          <Text className="text-gray-600 leading-6 mb-8">{product.description}</Text>

          {relatedProducts.length > 0 ? (
            <>
              <Text className="text-lg font-bold text-gray-800 mb-3">Related Products</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-2 mb-8">
                {relatedProducts.map((item) => (
                  <TouchableOpacity
                    key={item._id}
                    className="bg-gray-50 rounded-2xl p-3 mx-2 border border-gray-100 w-40"
                    onPress={() => navigation.push('ProductDetails', { id: item._id })}
                  >
                    <Image source={{ uri: item.image }} className="w-full h-28 rounded-xl mb-2" resizeMode="cover" />
                    <Text className="text-gray-800 font-bold" numberOfLines={2}>{item.title}</Text>
                    <Text className="text-sky-600 font-bold mt-1">${item.price}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          ) : null}
        </View>
      </ScrollView>

      <View className="p-4 bg-white border-t border-gray-100">
        <TouchableOpacity
          className={`bg-sky-600 py-4 rounded-xl items-center ${product.stock === 0 || cartLoading ? 'opacity-50' : ''}`}
          onPress={handleAddToCart}
          disabled={product.stock === 0 || cartLoading}
        >
          {cartLoading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Add to Cart</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
