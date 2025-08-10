import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export interface UserProfileData {
  height: number;
  weight: number;
  age: number;
  gender: string;
  activity_level: string;
  goal: string;
}

interface UserProfileCardProps {
  userProfile: UserProfileData;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({userProfile}) => {
  const getGoalText = (goal: string) => {
    switch (goal) {
      case 'lose':
        return 'Giảm cân';
      case 'maintain':
        return 'Duy trì cân nặng';
      case 'gain':
        return 'Tăng cân';
      default:
        return goal;
    }
  };

  const getActivityText = (level: string) => {
    switch (level) {
      case 'sedentary':
        return 'Ít vận động';
      case 'light':
        return 'Vận động nhẹ';
      case 'moderate':
        return 'Vận động vừa phải';
      case 'active':
        return 'Vận động nhiều';
      case 'very_active':
        return 'Vận động rất nhiều';
      default:
        return level;
    }
  };

  const getGenderText = (gender: string) => {
    return gender === 'male' ? 'Nam' : 'Nữ';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Thông tin cá nhân</Text>
      
      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Chiều cao</Text>
          <Text style={styles.infoValue}>{userProfile.height} cm</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Cân nặng</Text>
          <Text style={styles.infoValue}>{userProfile.weight} kg</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Tuổi</Text>
          <Text style={styles.infoValue}>{userProfile.age} tuổi</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Giới tính</Text>
          <Text style={styles.infoValue}>{getGenderText(userProfile.gender)}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Mức độ vận động</Text>
          <Text style={styles.infoValue}>{getActivityText(userProfile.activity_level)}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Mục tiêu</Text>
          <Text style={styles.infoValue}>{getGoalText(userProfile.goal)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 12,
    textAlign: 'center',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    marginBottom: 12,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  infoLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#212529',
    fontWeight: 'bold',
  },
});

export default UserProfileCard;
