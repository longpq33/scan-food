import {serverClient, handleApiError} from './apiClient';

export interface NutritionInfo {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
  serving_size: string;
  ingredients: string[];
  vitamins: {
    A: number;
    C: number;
    B1: number;
    B2: number;
    B6: number;
    B12: number;
  };
  minerals: {
    iron: number;
    calcium: number;
    zinc: number;
    potassium: number;
    magnesium: number;
  };
  description: string;
}

export interface UserProfile {
  height: number;
  weight: number;
  age: number;
  gender: string;
  activity_level: string;
  goal: string;
}

export interface FoodRecommendation {
  food_name: string;
  user_metrics: any;
  food_nutrition: any;
  analysis: any;
  recommendation: string;
  detailed_advice: string[];
  health_score: number;
}

export async function getNutritionInfo(
  dishName: string,
): Promise<NutritionInfo> {
  try {
    // Sử dụng serverClient từ apiClient
    const response = await serverClient.get(`/nutrition/analyze/${dishName}`);
    const data = response.data;

    // Chuyển đổi dữ liệu từ server format sang client format
    return {
      name: data.food_name || dishName,
      calories: data.calories || 0,
      protein: data.protein || 0,
      carbs: data.carbs || 0,
      fat: data.fat || 0,
      fiber: data.fiber || 0,
      sodium: data.sodium || 0,
      serving_size: data.serving_size || '1 phần',
      ingredients: ['Thành phần chính'], // Placeholder
      vitamins: {
        A: 0,
        C: 0,
        B1: 0,
        B2: 0,
        B6: 0,
        B12: 0,
      },
      minerals: {
        iron: 0,
        calcium: 0,
        zinc: 0,
        potassium: 0,
        magnesium: 0,
      },
      description: `Món ăn ${dishName} với thông tin dinh dưỡng chi tiết.`,
    };
  } catch (error) {
    console.error('Error fetching nutrition info:', error);
    throw new Error(
      handleApiError(error, 'Không thể lấy thông tin dinh dưỡng'),
    );
  }
}

export async function getFoodRecommendation(
  dishName: string,
  userProfile: UserProfile,
): Promise<FoodRecommendation> {
  try {
    const response = await serverClient.post('/nutrition/food-recommendation', {
      food_name: dishName,
      ...userProfile,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching food recommendation:', error);
    throw new Error(
      handleApiError(error, 'Không thể lấy khuyến nghị dinh dưỡng'),
    );
  }
}

export async function getNutritionSummary(foodKey: string): Promise<any> {
  try {
    const response = await serverClient.get(`/nutrition/summary/${foodKey}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching nutrition summary:', error);
    throw new Error(handleApiError(error, 'Không thể lấy tóm tắt dinh dưỡng'));
  }
}

export async function getHealthScore(foodKey: string): Promise<any> {
  try {
    const response = await serverClient.get(
      `/nutrition/health-score/${foodKey}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching health score:', error);
    throw new Error(handleApiError(error, 'Không thể lấy điểm sức khỏe'));
  }
}

export async function searchFoods(query: string): Promise<any> {
  try {
    const response = await serverClient.get(
      `/nutrition/search?query=${encodeURIComponent(query)}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error searching foods:', error);
    throw new Error(handleApiError(error, 'Không thể tìm kiếm món ăn'));
  }
}
