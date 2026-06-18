import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SplashScreen() {
  const scale = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, scale]);

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-sky-600 px-8">
      <Animated.View style={{ opacity, transform: [{ scale }] }} className="items-center">
        <View className="w-24 h-24 bg-white rounded-3xl items-center justify-center mb-6 shadow-lg">
          <Text className="text-sky-600 text-4xl font-bold">E</Text>
        </View>
        <Text className="text-white text-4xl font-bold mb-2">E-Shop</Text>
        <Text className="text-sky-100 text-center text-base">Premium shopping, delivered fast.</Text>
      </Animated.View>
    </SafeAreaView>
  );
}
