import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {
  UserProfileService,
  UserProfile,
  UserMetrics,
} from '../services/userProfileService';

const UserProfileScreen: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(
    UserProfileService.getDefaultProfile(),
  );
  const [metrics, setMetrics] = useState<UserMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileSaved, setIsProfileSaved] = useState(false);

  const activityLevels = [
    {
      value: 'sedentary',
      label: 'Ít vận động',
      description: 'Làm việc văn phòng, ít vận động',
    },
    {
      value: 'light',
      label: 'Vận động nhẹ',
      description: 'Vận động nhẹ 1-3 lần/tuần',
    },
    {
      value: 'moderate',
      label: 'Vận động vừa phải',
      description: 'Vận động vừa phải 3-5 lần/tuần',
    },
    {
      value: 'active',
      label: 'Vận động nhiều',
      description: 'Vận động mạnh 6-7 lần/tuần',
    },
    {
      value: 'very_active',
      label: 'Vận động rất nhiều',
      description: 'Vận động rất mạnh, thể thao chuyên nghiệp',
    },
  ];

  const goals = [
    {
      value: 'lose_weight',
      label: 'Giảm cân',
      description: 'Giảm cân an toàn và hiệu quả',
    },
    {
      value: 'maintain',
      label: 'Duy trì cân nặng',
      description: 'Giữ cân nặng hiện tại',
    },
    {
      value: 'gain_weight',
      label: 'Tăng cân',
      description: 'Tăng cân lành mạnh',
    },
  ];

  // Load thông tin người dùng khi component mount
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const savedProfile = await UserProfileService.getUserProfile();
      const savedMetrics = await UserProfileService.getUserMetrics();

      if (savedProfile) {
        setProfile(savedProfile);
        setIsProfileSaved(true);
      }

      if (savedMetrics) {
        setMetrics(savedMetrics);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const calculateMetrics = async () => {
    if (!profile.height || !profile.weight || !profile.age) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setIsLoading(true);
    try {
      const calculatedMetrics = await UserProfileService.calculateUserMetrics(
        profile,
      );
      setMetrics(calculatedMetrics);
      setIsProfileSaved(true);
      Alert.alert('Thành công', 'Đã tính toán và lưu các chỉ số sức khỏe!');
    } catch (error) {
      console.error('Error calculating metrics:', error);
      Alert.alert('Lỗi', 'Không thể tính toán các chỉ số sức khỏe');
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!profile.height || !profile.weight || !profile.age) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    try {
      await UserProfileService.saveUserProfile(profile);
      setIsProfileSaved(true);
      Alert.alert('Thành công', 'Đã lưu thông tin cá nhân!');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Lỗi', 'Không thể lưu thông tin cá nhân');
    }
  };

  const clearData = async () => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa tất cả thông tin cá nhân?', [
      {text: 'Hủy', style: 'cancel'},
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            await UserProfileService.clearUserData();
            setProfile(UserProfileService.getDefaultProfile());
            setMetrics(null);
            setIsProfileSaved(false);
            Alert.alert('Thành công', 'Đã xóa tất cả thông tin cá nhân');
          } catch (error) {
            console.error('Error clearing data:', error);
            Alert.alert('Lỗi', 'Không thể xóa thông tin cá nhân');
          }
        },
      },
    ]);
  };

  const renderMetrics = () => {
    if (!metrics) return null;

    return (
      <View style={styles.metricsContainer}>
        <Text style={styles.metricsTitle}>📊 Chỉ số sức khỏe của bạn</Text>

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>BMI:</Text>
          <Text style={styles.metricValue}>{metrics.bmi}</Text>
          <Text style={styles.metricCategory}>({metrics.bmi_category})</Text>
        </View>

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>BMR:</Text>
          <Text style={styles.metricValue}>{metrics.bmr} cal/ngày</Text>
        </View>

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>TDEE:</Text>
          <Text style={styles.metricValue}>{metrics.tdee} cal/ngày</Text>
        </View>

        <Text style={styles.sectionTitle}>
          🎯 Mục tiêu dinh dưỡng hàng ngày
        </Text>

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Calories:</Text>
          <Text style={styles.metricValue}>
            {metrics.daily_calories_target} cal
          </Text>
        </View>

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Protein:</Text>
          <Text style={styles.metricValue}>
            {metrics.daily_protein_target}g
          </Text>
        </View>

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Carbs:</Text>
          <Text style={styles.metricValue}>{metrics.daily_carbs_target}g</Text>
        </View>

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Fat:</Text>
          <Text style={styles.metricValue}>{metrics.daily_fat_target}g</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>👤 Hồ sơ sức khỏe</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📏 Thông tin cơ bản</Text>

        <View style={styles.inputRow}>
          <Text style={styles.label}>Chiều cao (cm):</Text>
          <TextInput
            style={styles.input}
            value={profile.height.toString()}
            onChangeText={text =>
              setProfile({...profile, height: parseFloat(text) || 0})
            }
            keyboardType="numeric"
            placeholder="170"
          />
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.label}>Cân nặng (kg):</Text>
          <TextInput
            style={styles.input}
            value={profile.weight.toString()}
            onChangeText={text =>
              setProfile({...profile, weight: parseFloat(text) || 0})
            }
            keyboardType="numeric"
            placeholder="70"
          />
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.label}>Tuổi:</Text>
          <TextInput
            style={styles.input}
            value={profile.age.toString()}
            onChangeText={text =>
              setProfile({...profile, age: parseInt(text) || 0})
            }
            keyboardType="numeric"
            placeholder="25"
          />
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.label}>Giới tính:</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={[
                styles.radioButton,
                profile.gender === 'male' && styles.radioButtonActive,
              ]}
              onPress={() => setProfile({...profile, gender: 'male'})}>
              <Text
                style={[
                  styles.radioText,
                  profile.gender === 'male' && styles.radioTextActive,
                ]}>
                Nam
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioButton,
                profile.gender === 'female' && styles.radioButtonActive,
              ]}
              onPress={() => setProfile({...profile, gender: 'female'})}>
              <Text
                style={[
                  styles.radioText,
                  profile.gender === 'female' && styles.radioTextActive,
                ]}>
                Nữ
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏃‍♂️ Mức độ hoạt động</Text>
        {activityLevels.map(level => (
          <TouchableOpacity
            key={level.value}
            style={[
              styles.optionButton,
              profile.activity_level === level.value &&
                styles.optionButtonActive,
            ]}
            onPress={() =>
              setProfile({...profile, activity_level: level.value})
            }>
            <View style={styles.optionContent}>
              <Text
                style={[
                  styles.optionLabel,
                  profile.activity_level === level.value &&
                    styles.optionLabelActive,
                ]}>
                {level.label}
              </Text>
              <Text style={styles.optionDescription}>{level.description}</Text>
            </View>
            {profile.activity_level === level.value && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎯 Mục tiêu</Text>
        {goals.map(goal => (
          <TouchableOpacity
            key={goal.value}
            style={[
              styles.optionButton,
              profile.goal === goal.value && styles.optionButtonActive,
            ]}
            onPress={() => setProfile({...profile, goal: goal.value})}>
            <View style={styles.optionContent}>
              <Text
                style={[
                  styles.optionLabel,
                  profile.goal === goal.value && styles.optionLabelActive,
                ]}>
                {goal.label}
              </Text>
              <Text style={styles.optionDescription}>{goal.description}</Text>
            </View>
            {profile.goal === goal.value && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.saveButton, isProfileSaved && styles.saveButtonSaved]}
          onPress={saveProfile}>
          <Text style={styles.saveButtonText}>
            {isProfileSaved ? '✓ Đã lưu' : '💾 Lưu thông tin'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.calculateButton,
            isLoading && styles.calculateButtonDisabled,
          ]}
          onPress={calculateMetrics}
          disabled={isLoading}>
          <Text style={styles.calculateButtonText}>
            {isLoading ? 'Đang tính toán...' : '🧮 Tính toán chỉ số sức khỏe'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.clearButton} onPress={clearData}>
          <Text style={styles.clearButtonText}>🗑️ Xóa dữ liệu</Text>
        </TouchableOpacity>
      </View>

      {renderMetrics()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: '#555',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#000',
  },
  radioGroup: {
    flexDirection: 'row',
    flex: 1,
  },
  radioButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  radioButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  radioText: {
    fontSize: 16,
    color: '#555',
  },
  radioTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: 'white',
  },
  optionButtonActive: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  optionLabelActive: {
    color: '#2196F3',
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
  },
  checkmark: {
    fontSize: 20,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  calculateButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  calculateButtonDisabled: {
    backgroundColor: '#ccc',
  },
  calculateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  metricsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  metricLabel: {
    flex: 1,
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  metricValue: {
    flex: 1,
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    textAlign: 'right',
  },
  metricCategory: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginLeft: 8,
  },
  buttonContainer: {
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButtonSaved: {
    backgroundColor: '#2E7D32',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  clearButton: {
    backgroundColor: '#F44336',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  clearButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default UserProfileScreen;
