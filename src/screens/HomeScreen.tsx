import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const GREEN = '#2E7D32';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>NutriScan - Home</Text>
      <Text>Chọn tab Scan để nhận diện món ăn từ ảnh.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 8, color: GREEN },
});
