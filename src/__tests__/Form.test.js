import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Form from '../components/Form';

// Silence console during tests
beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  console.log.mockRestore();
  console.error.mockRestore();
});

// Mock Alert.alert
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

describe('Form Component', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders all form fields', () => {
      const { getByTestId, getByText } = render(<Form />);

      expect(getByTestId('name-input')).toBeTruthy();
      expect(getByTestId('email-input')).toBeTruthy();
      expect(getByTestId('message-input')).toBeTruthy();
      expect(getByTestId('submit-button')).toBeTruthy();
      expect(getByText('Formulario de Contacto')).toBeTruthy();
    });

    it('renders labels for all fields', () => {
      const { getByText } = render(<Form />);

      expect(getByText('Nombre')).toBeTruthy();
      expect(getByText('Email')).toBeTruthy();
      expect(getByText('Mensaje')).toBeTruthy();
    });
  });

  describe('Validation', () => {
    it('shows error when name is empty', async () => {
      const { getByTestId, findByTestId } = render(<Form />);

      fireEvent.press(getByTestId('submit-button'));

      const nameError = await findByTestId('name-error');
      expect(nameError).toHaveTextContent('El nombre es requerido');
    });

    it('shows error when name is too short', async () => {
      const { getByTestId, findByTestId } = render(<Form />);

      fireEvent.changeText(getByTestId('name-input'), 'A');
      fireEvent.press(getByTestId('submit-button'));

      const nameError = await findByTestId('name-error');
      expect(nameError).toHaveTextContent('El nombre debe tener al menos 2 caracteres');
    });

    it('shows error when email is empty', async () => {
      const { getByTestId, findByTestId } = render(<Form />);

      fireEvent.changeText(getByTestId('name-input'), 'John Doe');
      fireEvent.press(getByTestId('submit-button'));

      const emailError = await findByTestId('email-error');
      expect(emailError).toHaveTextContent('El email es requerido');
    });

    it('shows error when email is invalid', async () => {
      const { getByTestId, findByTestId } = render(<Form />);

      fireEvent.changeText(getByTestId('name-input'), 'John Doe');
      fireEvent.changeText(getByTestId('email-input'), 'invalid-email');
      fireEvent.press(getByTestId('submit-button'));

      const emailError = await findByTestId('email-error');
      expect(emailError).toHaveTextContent('El email no es válido');
    });

    it('shows error when message is empty', async () => {
      const { getByTestId, findByTestId } = render(<Form />);

      fireEvent.changeText(getByTestId('name-input'), 'John Doe');
      fireEvent.changeText(getByTestId('email-input'), 'john@example.com');
      fireEvent.press(getByTestId('submit-button'));

      const messageError = await findByTestId('message-error');
      expect(messageError).toHaveTextContent('El mensaje es requerido');
    });

    it('shows error when message is too short', async () => {
      const { getByTestId, findByTestId } = render(<Form />);

      fireEvent.changeText(getByTestId('name-input'), 'John Doe');
      fireEvent.changeText(getByTestId('email-input'), 'john@example.com');
      fireEvent.changeText(getByTestId('message-input'), 'Short');
      fireEvent.press(getByTestId('submit-button'));

      const messageError = await findByTestId('message-error');
      expect(messageError).toHaveTextContent('El mensaje debe tener al menos 10 caracteres');
    });
  });

  describe('Form Submission', () => {
    const validFormData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a test message that is long enough',
    };

    it('submits form successfully with valid data', async () => {
      const mockResponse = { id: 1, created_at: '2024-01-01T00:00:00Z' };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const onSubmitSuccess = jest.fn();
      const { getByTestId } = render(
        <Form apiUrl="http://test.com" onSubmitSuccess={onSubmitSuccess} />
      );

      fireEvent.changeText(getByTestId('name-input'), validFormData.name);
      fireEvent.changeText(getByTestId('email-input'), validFormData.email);
      fireEvent.changeText(getByTestId('message-input'), validFormData.message);
      fireEvent.press(getByTestId('submit-button'));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'http://test.com/api/submissions',
          expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validFormData),
          })
        );
      });

      await waitFor(() => {
        expect(onSubmitSuccess).toHaveBeenCalledWith(mockResponse);
      });
    });

    it('handles server error during submission', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Server error' }),
      });

      const onSubmitError = jest.fn();
      const { getByTestId } = render(
        <Form apiUrl="http://test.com" onSubmitError={onSubmitError} />
      );

      fireEvent.changeText(getByTestId('name-input'), validFormData.name);
      fireEvent.changeText(getByTestId('email-input'), validFormData.email);
      fireEvent.changeText(getByTestId('message-input'), validFormData.message);
      fireEvent.press(getByTestId('submit-button'));

      await waitFor(() => {
        expect(onSubmitError).toHaveBeenCalled();
      });
    });

    it('handles network error during submission', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      const onSubmitError = jest.fn();
      const { getByTestId } = render(
        <Form apiUrl="http://test.com" onSubmitError={onSubmitError} />
      );

      fireEvent.changeText(getByTestId('name-input'), validFormData.name);
      fireEvent.changeText(getByTestId('email-input'), validFormData.email);
      fireEvent.changeText(getByTestId('message-input'), validFormData.message);
      fireEvent.press(getByTestId('submit-button'));

      await waitFor(() => {
        expect(onSubmitError).toHaveBeenCalled();
      });
    });
  });

  describe('Input Handling', () => {
    it('clears error when user starts typing', async () => {
      const { getByTestId, findByTestId, queryByTestId } = render(<Form />);

      // Trigger validation error
      fireEvent.press(getByTestId('submit-button'));
      await findByTestId('name-error');

      // Start typing in the name field
      fireEvent.changeText(getByTestId('name-input'), 'J');

      // Error should be cleared
      expect(queryByTestId('name-error')).toBeNull();
    });

    it('updates form data on text change', () => {
      const { getByTestId } = render(<Form />);

      const nameInput = getByTestId('name-input');
      fireEvent.changeText(nameInput, 'Test Name');

      expect(nameInput.props.value).toBe('Test Name');
    });
  });
});
