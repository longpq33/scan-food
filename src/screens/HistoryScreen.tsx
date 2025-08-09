import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const GREEN = '#2E7D32';

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lịch sử nhận diện</Text>
      <Text>Chức năng sẽ lưu kết quả khi tích hợp sau.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {fontSize: 22, fontWeight: 'bold', marginBottom: 8, color: GREEN},
});
