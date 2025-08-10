import AsyncStorage from '@react-native-async-storage/async-storage';
import {serverClient, handleApiError} from './apiClient';

export interface UserProfile {
  height: number;
  weight: number;
  age: number;
  gender: string;
  activity_level: string;
  goal: string;
}

export interface UserMetrics {
  bmi: number;
  bmi_category: string;
  bmr: number;
  tdee: number;
  daily_calories_target: number;
  daily_protein_target: number;
  daily_carbs_target: number;
  daily_fat_target: number;
}

const USER_PROFILE_KEY = '@user_profile';
const USER_METRICS_KEY = '@user_metrics';

export class UserProfileService {
  /**
   * Lưu thông tin người dùng vào AsyncStorage
   */
  static async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw new Error('Không thể lưu thông tin người dùng');
    }
  }

  /**
   * Lấy thông tin người dùng từ AsyncStorage
   */
  static async getUserProfile(): Promise<UserProfile | null> {
    try {
      const profileJson = await AsyncStorage.getItem(USER_PROFILE_KEY);
      if (profileJson) {
        return JSON.parse(profileJson);
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  /**
   * Lưu chỉ số sức khỏe người dùng vào AsyncStorage
   */
  static async saveUserMetrics(metrics: UserMetrics): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_METRICS_KEY, JSON.stringify(metrics));
    } catch (error) {
      console.error('Error saving user metrics:', error);
      throw new Error('Không thể lưu chỉ số sức khỏe');
    }
  }

  /**
   * Lấy chỉ số sức khỏe người dùng từ AsyncStorage
   */
  static async getUserMetrics(): Promise<UserMetrics | null> {
    try {
      const metricsJson = await AsyncStorage.getItem(USER_METRICS_KEY);
      if (metricsJson) {
        return JSON.parse(metricsJson);
      }
      return null;
    } catch (error) {
      console.error('Error getting user metrics:', error);
      return null;
    }
  }

  /**
   * Tính toán các chỉ số sức khỏe từ server
   */
  static async calculateUserMetrics(
    profile: UserProfile,
  ): Promise<UserMetrics> {
    try {
      const response = await serverClient.post(
        '/nutrition/analyze-body',
        profile,
      );
      const metrics = response.data;

      // Lưu vào storage
      await this.saveUserProfile(profile);
      await this.saveUserMetrics(metrics);

      return metrics;
    } catch (error) {
      console.error('Error calculating user metrics:', error);
      throw new Error(
        handleApiError(error, 'Không thể tính toán các chỉ số sức khỏe'),
      );
    }
  }

  /**
   * Lấy thông tin mặc định cho người dùng mới
   */
  static getDefaultProfile(): UserProfile {
    return {
      height: 170,
      weight: 70,
      age: 25,
      gender: 'male',
      activity_level: 'moderate',
      goal: 'maintain',
    };
  }

  /**
   * Kiểm tra xem người dùng đã có thông tin chưa
   */
  static async hasUserProfile(): Promise<boolean> {
    const profile = await this.getUserProfile();
    return profile !== null;
  }

  /**
   * Xóa tất cả thông tin người dùng
   */
  static async clearUserData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([USER_PROFILE_KEY, USER_METRICS_KEY]);
    } catch (error) {
      console.error('Error clearing user data:', error);
      throw new Error('Không thể xóa thông tin người dùng');
    }
  }
}
