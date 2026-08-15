import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider, AuthContext } from '../src/context/AuthContext';
import { WishlistProvider } from '../src/context/WishlistContext';
import { View, ActivityIndicator } from 'react-native';
import { useContext } from 'react';

function RootLayoutNav() {
  const { firebaseUser, loading } = useContext(AuthContext);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)' ||
      segments.includes('login') ||
      segments.includes('register') ||
      segments.includes('forgot-password') ||
      segments.includes('onboarding');

    const isRegister = segments.includes('register');

    if (!firebaseUser && !inAuthGroup) {
      router.replace('/onboarding');
    } else if (firebaseUser && inAuthGroup && !isRegister) {
      router.replace('/');
    }
  }, [firebaseUser, segments, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0f7f75" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Home', headerShown: false }} />
        <Stack.Screen name="wishlist" options={{ title: 'Wishlist', headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
        <Stack.Screen name="change-password" options={{ headerShown: false }} />
      </Stack>
    </GestureHandlerRootView>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <RootLayoutNav />
      </WishlistProvider>
    </AuthProvider>
  );
}
