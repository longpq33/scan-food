import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';

interface LoadingCardProps {
  message: string;
  color?: string;
}

const LoadingCard: React.FC<LoadingCardProps> = ({message, color = '#2E7D32'}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color={color} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  message: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '500',
  },
});

export default LoadingCard;
