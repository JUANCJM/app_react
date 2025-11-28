import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import Header from '../components/Header';
import Form from '../components/Form';
import { colors, spacing } from '../styles/global';

/**
 * FormScreen - Screen displaying the contact form
 * @param {Object} props - Component props
 * @param {Object} props.navigation - React Navigation object (if using react-navigation)
 * @param {Function} props.onGoBack - Callback for going back (simple navigation)
 * @param {string} props.apiUrl - Base URL for the API server
 * @returns {React.ReactElement} FormScreen component
 */
const FormScreen = ({ navigation, onGoBack, apiUrl }) => {
  const handleGoBack = () => {
    if (navigation && navigation.goBack) {
      navigation.goBack();
    } else if (onGoBack) {
      onGoBack();
    }
  };

  const handleSubmitSuccess = (data) => {
    console.log('Form submitted successfully:', data);
  };

  const handleSubmitError = (error) => {
    console.error('Form submission error:', error);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Formulario" />
      <ScrollView style={styles.scrollView}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
          testID="back-button"
          accessibilityLabel="Volver"
        >
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <View style={styles.formContainer}>
          <Form
            apiUrl={apiUrl}
            onSubmitSuccess={handleSubmitSuccess}
            onSubmitError={handleSubmitError}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  backButton: {
    padding: spacing.md,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  formContainer: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.lg,
  },
});

export default FormScreen;
