import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, AuthContext } from '../src/context/AuthContext';
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

    if (!firebaseUser && !inAuthGroup) {
      router.replace('/onboarding');
    } else if (firebaseUser && inAuthGroup) {
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
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ title: 'Login', headerShown: false }} />
      <Stack.Screen name="register" options={{ title: 'Register', headerShown: false }} />
      <Stack.Screen name="forgot-password" options={{ title: 'Forgot Password', headerShown: false }} />
      <Stack.Screen name="change-password" options={{ title: 'Change Password', headerShown: false }} />
    </Stack>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
