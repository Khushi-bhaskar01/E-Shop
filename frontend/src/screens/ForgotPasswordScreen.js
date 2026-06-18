import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const handleReset = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    Alert.alert('Success', 'Password reset link sent to your email');
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-6 justify-center">
      <View className="mb-10 items-center">
        <Text className="text-4xl font-bold text-sky-600 mb-2">Reset Password</Text>
        <Text className="text-gray-500 text-center">Enter your email and we will send you a link to reset your password.</Text>
      </View>

      <View className="space-y-4">
        <TextInput
          className="bg-gray-100 p-4 rounded-xl text-gray-800"
          placeholder="Email address"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <TouchableOpacity 
        onPress={handleReset}
        className="bg-sky-600 p-4 rounded-xl mt-8 items-center"
      >
        <Text className="text-white font-bold text-lg">Send Reset Link</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => navigation.navigate('Login')}
        className="mt-6 items-center"
      >
        <Text className="text-sky-600 font-bold">Back to Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
