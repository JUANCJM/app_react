import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../styles/global';

/**
 * Header component - Simple header for the app
 * @param {Object} props - Component props
 * @param {string} props.title - The title to display in the header
 * @returns {React.ReactElement} Header component
 */
const Header = ({ title = 'App React' }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Header;
