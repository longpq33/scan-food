import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';

const GREEN = '#2E7D32';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>🍽️ NutriScan</Text>
      <Text style={styles.subtitle}>
        Ứng dụng phân tích dinh dưỡng thông minh
      </Text>

      <View style={styles.featureCard}>
        <Text style={styles.featureTitle}>📱 Chức năng chính</Text>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>👤</Text>
          <View style={styles.featureText}>
            <Text style={styles.featureName}>Hồ sơ sức khỏe</Text>
            <Text style={styles.featureDesc}>
              Nhập thông tin cá nhân để tính toán BMI, BMR, TDEE
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>📸</Text>
          <View style={styles.featureText}>
            <Text style={styles.featureName}>Nhận diện món ăn</Text>
            <Text style={styles.featureDesc}>
              Chụp ảnh hoặc chọn ảnh để nhận diện món ăn
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>📊</Text>
          <View style={styles.featureText}>
            <Text style={styles.featureName}>Phân tích dinh dưỡng</Text>
            <Text style={styles.featureDesc}>
              Xem thông tin chi tiết về calories, protein, carbs, fat
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>🎯</Text>
          <View style={styles.featureText}>
            <Text style={styles.featureName}>Khuyến nghị cá nhân</Text>
            <Text style={styles.featureDesc}>
              So sánh với nhu cầu cá nhân và đưa ra lời khuyên
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.quickStartCard}>
        <Text style={styles.quickStartTitle}>🚀 Bắt đầu ngay</Text>
        <Text style={styles.quickStartText}>
          1. Vào tab Profile để nhập thông tin cá nhân{'\n'}
          2. Sử dụng tab Scan để chụp ảnh món ăn{'\n'}
          3. Xem phân tích dinh dưỡng và khuyến nghị{'\n'}
          4. Theo dõi lịch sử trong tab History
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>ℹ️ Thông tin</Text>
        <Text style={styles.infoText}>
          • App sử dụng AI để nhận diện món ăn Việt Nam{'\n'}• Dữ liệu dinh
          dưỡng được cập nhật thường xuyên{'\n'}• Khuyến nghị dựa trên tiêu
          chuẩn dinh dưỡng quốc tế{'\n'}• Bảo mật thông tin cá nhân của người
          dùng
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: GREEN,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  featureCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 16,
    width: 40,
    textAlign: 'center',
  },
  featureText: {
    flex: 1,
  },
  featureName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  quickStartCard: {
    backgroundColor: GREEN,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  quickStartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'white',
    textAlign: 'center',
  },
  quickStartText: {
    fontSize: 15,
    color: 'white',
    lineHeight: 22,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
