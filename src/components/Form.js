import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing } from '../styles/global';

/**
 * Form Component - A controlled form for submitting user data
 * 
 * @component
 * @description
 * This component provides a form with three fields: name, email, and message.
 * It includes validation for all fields and submits the data to the backend API.
 * 
 * @param {Object} props - Component props
 * @param {string} [props.apiUrl='http://localhost:3000'] - Base URL for the API server
 *   - For Android emulator, use 'http://10.0.2.2:3000'
 *   - For iOS simulator, use 'http://localhost:3000'
 *   - For physical device, use your machine's local IP address
 * @param {Function} [props.onSubmitSuccess] - Callback function called on successful submission
 * @param {Function} [props.onSubmitError] - Callback function called on submission error
 * 
 * @state {Object} formData - The form field values { name, email, message }
 * @state {Object} errors - Validation error messages for each field
 * @state {boolean} isSubmitting - Loading state during form submission
 * 
 * @flow
 * 1. User fills in the form fields
 * 2. On field change, the formData state is updated
 * 3. On submit button press:
 *    a. validateForm() checks all fields
 *    b. If validation fails, errors are displayed
 *    c. If validation passes, data is sent via POST to /api/submissions
 *    d. On success: form is reset and success message is shown
 *    e. On error: error message is displayed
 * 
 * @example
 * <Form 
 *   apiUrl="http://10.0.2.2:3000"
 *   onSubmitSuccess={(data) => console.log('Success:', data)}
 *   onSubmitError={(error) => console.log('Error:', error)}
 * />
 * 
 * @returns {React.ReactElement} Form component
 */
const Form = ({ 
  apiUrl = 'http://localhost:3000', 
  onSubmitSuccess, 
  onSubmitError 
}) => {
  // Form data state - holds the values of all form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  // Validation errors state - holds error messages for each field
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: '',
  });

  // Loading state for submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Validates an email address using a regex pattern
   * @param {string} email - The email to validate
   * @returns {boolean} True if email is valid, false otherwise
   */
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Validates all form fields
   * @returns {boolean} True if all fields are valid, false otherwise
   */
  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      message: '',
    };
    let isValid = true;

    // Validate name - must not be empty
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
      isValid = false;
    }

    // Validate email - must be a valid email format
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
      isValid = false;
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'El email no es válido';
      isValid = false;
    }

    // Validate message - must not be empty and have minimum length
    if (!formData.message.trim()) {
      newErrors.message = 'El mensaje es requerido';
      isValid = false;
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'El mensaje debe tener al menos 10 caracteres';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  /**
   * Handles changes to form input fields
   * @param {string} field - The name of the field being updated
   * @param {string} value - The new value for the field
   */
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  /**
   * Resets the form to its initial state
   */
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      message: '',
    });
    setErrors({
      name: '',
      email: '',
      message: '',
    });
  };

  /**
   * Handles form submission
   * - Validates form data
   * - Sends POST request to /api/submissions
   * - Handles success and error responses
   */
  const handleSubmit = async () => {
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Send POST request to backend API
      const response = await fetch(`${apiUrl}/api/submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar el formulario');
      }

      // Success: reset form and notify user
      resetForm();
      Alert.alert(
        'Éxito',
        `Formulario enviado correctamente. ID: ${data.id}`,
        [{ text: 'OK' }]
      );

      // Call success callback if provided
      if (onSubmitSuccess) {
        onSubmitSuccess(data);
      }
    } catch (error) {
      // Error: show error message
      Alert.alert(
        'Error',
        error.message || 'No se pudo enviar el formulario. Intente nuevamente.',
        [{ text: 'OK' }]
      );

      // Call error callback if provided
      if (onSubmitError) {
        onSubmitError(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Formulario de Contacto</Text>

      {/* Name Field */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={[styles.input, errors.name ? styles.inputError : null]}
          value={formData.name}
          onChangeText={(value) => handleChange('name', value)}
          placeholder="Ingrese su nombre"
          placeholderTextColor={colors.textSecondary}
          testID="name-input"
          accessibilityLabel="Campo de nombre"
        />
        {errors.name ? (
          <Text style={styles.errorText} testID="name-error">
            {errors.name}
          </Text>
        ) : null}
      </View>

      {/* Email Field */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, errors.email ? styles.inputError : null]}
          value={formData.email}
          onChangeText={(value) => handleChange('email', value)}
          placeholder="Ingrese su email"
          placeholderTextColor={colors.textSecondary}
          keyboardType="email-address"
          autoCapitalize="none"
          testID="email-input"
          accessibilityLabel="Campo de email"
        />
        {errors.email ? (
          <Text style={styles.errorText} testID="email-error">
            {errors.email}
          </Text>
        ) : null}
      </View>

      {/* Message Field */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Mensaje</Text>
        <TextInput
          style={[
            styles.input,
            styles.textArea,
            errors.message ? styles.inputError : null,
          ]}
          value={formData.message}
          onChangeText={(value) => handleChange('message', value)}
          placeholder="Ingrese su mensaje"
          placeholderTextColor={colors.textSecondary}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          testID="message-input"
          accessibilityLabel="Campo de mensaje"
        />
        {errors.message ? (
          <Text style={styles.errorText} testID="message-error">
            {errors.message}
          </Text>
        ) : null}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.button, isSubmitting ? styles.buttonDisabled : null]}
        onPress={handleSubmit}
        disabled={isSubmitting}
        testID="submit-button"
        accessibilityLabel="Botón enviar formulario"
      >
        {isSubmitting ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.buttonText}>Enviar</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  fieldContainer: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.sm,
    fontSize: 16,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.error,
  },
  textArea: {
    minHeight: 100,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: spacing.xs,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Form;
