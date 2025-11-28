import React, { useState } from 'react';
import { Platform } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import FormScreen from './src/screens/FormScreen';

/**
 * Main App Component
 * Uses simple state-based navigation between HomeScreen and FormScreen
 * 
 * API URL configuration:
 * - Android emulator: 10.0.2.2:3000 (maps to host machine's localhost)
 * - iOS simulator: localhost:3000
 * - Physical device: Use your machine's local IP address
 */

// Configure API URL based on platform
const getApiUrl = () => {
  if (Platform.OS === 'android') {
    // Android emulator uses 10.0.2.2 to access host machine's localhost
    return 'http://10.0.2.2:3000';
  }
  // iOS simulator and web can use localhost
  return 'http://localhost:3000';
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Home');
  const apiUrl = getApiUrl();

  const navigateToForm = () => {
    setCurrentScreen('Form');
  };

  const navigateToHome = () => {
    setCurrentScreen('Home');
  };

  if (currentScreen === 'Form') {
    return <FormScreen onGoBack={navigateToHome} apiUrl={apiUrl} />;
  }

  return <HomeScreen onNavigateToForm={navigateToForm} />;
}

