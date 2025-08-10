import AsyncStorage from '@react-native-async-storage/async-storage';

export interface HistoryItem {
  id: string;
  timestamp: number;
  date: string;
  foodName: string;
  confidence: number;
  nutritionInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sodium?: number;
    serving_size?: string;
    description?: string;
  };
  userMetrics?: {
    daily_calories_target: number;
    daily_protein_target: number;
    daily_carbs_target: number;
    daily_fat_target: number;
  };
  recommendation: string;
  healthScore: number;
  imageUri?: string;
  analysis?: {
    bmi_impact: string;
    nutrition_balance: string;
    meal_timing: string;
  };
}

const HISTORY_STORAGE_KEY = '@scan_food_history';
const MAX_HISTORY_ITEMS = 100; // Giới hạn số lượng lịch sử

export class HistoryService {
  /**
   * Lưu một item mới vào lịch sử
   */
  static async saveHistoryItem(item: Omit<HistoryItem, 'id' | 'timestamp' | 'date'>): Promise<void> {
    try {
      const history = await this.getHistory();
      
      const newItem: HistoryItem = {
        ...item,
        id: Date.now().toString(),
        timestamp: Date.now(),
        date: new Date().toLocaleString('vi-VN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      // Thêm item mới vào đầu danh sách
      const updatedHistory = [newItem, ...history];

      // Giới hạn số lượng item
      if (updatedHistory.length > MAX_HISTORY_ITEMS) {
        updatedHistory.splice(MAX_HISTORY_ITEMS);
      }

      await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
      console.log('✅ Lưu lịch sử thành công:', newItem.foodName);
    } catch (error) {
      console.error('❌ Lỗi khi lưu lịch sử:', error);
      throw new Error('Không thể lưu lịch sử');
    }
  }

  /**
   * Lấy toàn bộ lịch sử
   */
  static async getHistory(): Promise<HistoryItem[]> {
    try {
      const historyJson = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
      if (historyJson) {
        return JSON.parse(historyJson);
      }
      return [];
    } catch (error) {
      console.error('❌ Lỗi khi lấy lịch sử:', error);
      return [];
    }
  }

  /**
   * Lấy lịch sử theo ngày
   */
  static async getHistoryByDate(date: string): Promise<HistoryItem[]> {
    try {
      const history = await this.getHistory();
      return history.filter(item => item.date.startsWith(date));
    } catch (error) {
      console.error('❌ Lỗi khi lấy lịch sử theo ngày:', error);
      return [];
    }
  }

  /**
   * Lấy lịch sử theo món ăn
   */
  static async getHistoryByFood(foodName: string): Promise<HistoryItem[]> {
    try {
      const history = await this.getHistory();
      return history.filter(item => 
        item.foodName.toLowerCase().includes(foodName.toLowerCase())
      );
    } catch (error) {
      console.error('❌ Lỗi khi lấy lịch sử theo món ăn:', error);
      return [];
    }
  }

  /**
   * Xóa một item khỏi lịch sử
   */
  static async deleteHistoryItem(id: string): Promise<void> {
    try {
      const history = await this.getHistory();
      const updatedHistory = history.filter(item => item.id !== id);
      await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
      console.log('✅ Xóa item lịch sử thành công');
    } catch (error) {
      console.error('❌ Lỗi khi xóa item lịch sử:', error);
      throw new Error('Không thể xóa item lịch sử');
    }
  }

  /**
   * Xóa toàn bộ lịch sử
   */
  static async clearHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
      console.log('✅ Xóa toàn bộ lịch sử thành công');
    } catch (error) {
      console.error('❌ Lỗi khi xóa lịch sử:', error);
      throw new Error('Không thể xóa lịch sử');
    }
  }

  /**
   * Lấy thống kê lịch sử
   */
  static async getHistoryStats(): Promise<{
    totalScans: number;
    totalCalories: number;
    averageHealthScore: number;
    mostScannedFood: string;
    favoriteFoods: Array<{name: string, count: number}>;
  }> {
    try {
      const history = await this.getHistory();
      
      if (history.length === 0) {
        return {
          totalScans: 0,
          totalCalories: 0,
          averageHealthScore: 0,
          mostScannedFood: '',
          favoriteFoods: [],
        };
      }

      const totalScans = history.length;
      const totalCalories = history.reduce((sum, item) => sum + item.nutritionInfo.calories, 0);
      const averageHealthScore = history.reduce((sum, item) => sum + item.healthScore, 0) / totalScans;

      // Đếm số lần quét mỗi món ăn
      const foodCounts: Record<string, number> = {};
      history.forEach(item => {
        foodCounts[item.foodName] = (foodCounts[item.foodName] || 0) + 1;
      });

      const favoriteFoods = Object.entries(foodCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      const mostScannedFood = favoriteFoods[0]?.name || '';

      return {
        totalScans,
        totalCalories,
        averageHealthScore: Math.round(averageHealthScore),
        mostScannedFood,
        favoriteFoods,
      };
    } catch (error) {
      console.error('❌ Lỗi khi lấy thống kê lịch sử:', error);
      return {
        totalScans: 0,
        totalCalories: 0,
        averageHealthScore: 0,
        mostScannedFood: '',
        favoriteFoods: [],
      };
    }
  }

  /**
   * Lấy lịch sử theo khoảng thời gian
   */
  static async getHistoryByTimeRange(startDate: Date, endDate: Date): Promise<HistoryItem[]> {
    try {
      const history = await this.getHistory();
      const startTimestamp = startDate.getTime();
      const endTimestamp = endDate.getTime();

      return history.filter(item => 
        item.timestamp >= startTimestamp && item.timestamp <= endTimestamp
      );
    } catch (error) {
      console.error('❌ Lỗi khi lấy lịch sử theo khoảng thời gian:', error);
      return [];
    }
  }
}
