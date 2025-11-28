import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Header from '../components/Header';
import { colors, spacing } from '../styles/global';

/**
 * HomeScreen - Welcome screen with navigation to FormScreen
 * @param {Object} props - Component props
 * @param {Object} props.navigation - React Navigation object (if using react-navigation)
 * @param {Function} props.onNavigateToForm - Callback for form navigation (simple navigation)
 * @returns {React.ReactElement} HomeScreen component
 */
const HomeScreen = ({ navigation, onNavigateToForm }) => {
  const handleNavigateToForm = () => {
    if (navigation && navigation.navigate) {
      navigation.navigate('Form');
    } else if (onNavigateToForm) {
      onNavigateToForm();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="App React" />
      <View style={styles.content}>
        <Text style={styles.title}>¡Bienvenido!</Text>
        <Text style={styles.subtitle}>App React Native con Expo</Text>
        <Text style={styles.description}>
          Esta aplicación de ejemplo incluye un formulario conectado a un
          servidor backend que guarda los datos en PostgreSQL.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={handleNavigateToForm}
          testID="go-to-form-button"
          accessibilityLabel="Ir al formulario"
        >
          <Text style={styles.buttonText}>Ir al Formulario</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
    paddingHorizontal: spacing.md,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default HomeScreen;
