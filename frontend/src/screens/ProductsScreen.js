import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../services/api';

export default function ProductsScreen({ navigation, route }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(route.params?.category || 'All');

  useEffect(() => {
    if (route.params?.category) {
      setSelectedCategory(route.params.category);
    }
  }, [route.params?.category]);

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

  const categories = useMemo(() => ['All', ...new Set(products.map((product) => product.category).filter(Boolean))], [products]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderItem = ({ item }) => (
    <TouchableOpacity
      className="bg-white rounded-2xl p-4 m-2 flex-1 shadow-sm border border-gray-100"
      onPress={() => navigation.navigate('ProductDetails', { id: item._id })}
    >
      <Image source={{ uri: item.image }} className="w-full h-32 rounded-xl mb-3" resizeMode="cover" />
      <Text className="text-gray-800 font-bold mb-1" numberOfLines={2}>
        {item.title}
      </Text>
      <Text className="text-gray-500 text-xs">{item.category}</Text>
      <View className="flex-row justify-between items-center mt-auto pt-2">
        <Text className="text-sky-600 font-bold">${item.price}</Text>
        <Text className="text-yellow-500 text-xs">Rating {item.rating}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 py-4 bg-white shadow-sm">
        <TextInput
          className="bg-gray-100 p-3 rounded-xl text-gray-800"
          placeholder="Search products..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View className="bg-white py-3 border-b border-gray-100">
        <FlatList
          data={categories}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              className={`px-4 py-2 rounded-full mr-2 border ${selectedCategory === item ? 'bg-sky-600 border-sky-600' : 'bg-white border-gray-200'}`}
              onPress={() => setSelectedCategory(item)}
            >
              <Text className={`${selectedCategory === item ? 'text-white' : 'text-gray-700'} font-medium`}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0ea5e9" />
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={{ padding: 8 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="py-20 items-center">
              <Text className="text-gray-500">No products found.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
