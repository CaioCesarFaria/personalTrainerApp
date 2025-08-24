// App.js
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigation from './src/navigation/AppNavigation';
import { AuthProvider } from './src/context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <AppNavigation />
      <StatusBar style="dark" backgroundColor="#F8FAFC" />
    </AuthProvider>
  );
}

