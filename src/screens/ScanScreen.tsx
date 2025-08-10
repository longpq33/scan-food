import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import {
  launchImageLibrary,
  ImagePickerResponse,
  launchCamera,
} from 'react-native-image-picker';
import {recognizeDishFromServerWithMeta} from '../services/foodRecognition';

import {UserProfileService, UserProfile} from '../services/userProfileService';
import NutritionInfoComponent, {
  NutritionInfo,
} from '../components/NutritionInfo';
import NutritionComparisonCard from '../components/NutritionComparisonCard';
import UserProfileCard from '../components/UserProfileCard';
import FoodRecommendationCard from '../components/FoodRecommendationCard';
import RecognitionResultCard from '../components/RecognitionResultCard';
import LoadingCard from '../components/LoadingCard';
import {
  getFoodRecommendation,
  getNutritionInfo,
} from '../services/nutritionService';
import {HistoryService, HistoryItem} from '../services/historyService';

const GREEN = '#2E7D32';

interface FoodRecommendation {
  food_name: string;
  user_metrics: any;
  food_nutrition: any;
  analysis: any;
  recommendation: string;
  detailed_advice: string[];
  health_score: number;
}

export default function ScanScreen(): React.JSX.Element {
  const [isBusy, setIsBusy] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const [result, setResult] = useState<{
    name: string;
    confidence?: number;
  } | null>(null);
  const [nutritionInfo, setNutritionInfo] = useState<NutritionInfo | null>(
    null,
  );
  const [isLoadingNutrition, setIsLoadingNutrition] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userMetrics, setUserMetrics] = useState<any>(null);
  const [foodRecommendation, setFoodRecommendation] =
    useState<FoodRecommendation | null>(null);
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(false);

  // Load thông tin người dùng từ UserProfileService
  useEffect(() => {
    loadUserProfile();
  }, []);

  // Lưu vào lịch sử khi có đầy đủ thông tin
  useEffect(() => {
    if (result && nutritionInfo && userMetrics) {
      saveToHistory(
        result.name,
        result.confidence || 0,
        nutritionInfo,
        foodRecommendation,
      );
    }
  }, [result, nutritionInfo, userMetrics, foodRecommendation]);

  const loadUserProfile = async () => {
    try {
      const savedProfile = await UserProfileService.getUserProfile();
      const savedMetrics = await UserProfileService.getUserMetrics();

      if (savedProfile) {
        setUserProfile(savedProfile);
      } else {
        // Sử dụng profile mặc định nếu chưa có
        setUserProfile(UserProfileService.getDefaultProfile());
      }

      if (savedMetrics) {
        setUserMetrics(savedMetrics);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      // Fallback to default profile
      setUserProfile(UserProfileService.getDefaultProfile());
    }
  };

  const loadNutritionInfo = async (dishName: string) => {
    try {
      setIsLoadingNutrition(true);
      const nutrition = await getNutritionInfo(dishName);
      setNutritionInfo(nutrition);
    } catch (error) {
      console.log('Không thể load thông tin dinh dưỡng:', error);
      setNutritionInfo(null);
    } finally {
      setIsLoadingNutrition(false);
    }
  };

  const loadFoodRecommendation = async (dishName: string) => {
    if (!userProfile) {
      Alert.alert(
        'Thông báo',
        'Vui lòng cập nhật thông tin cá nhân trong tab Profile trước',
      );
      return;
    }

    try {
      setIsLoadingRecommendation(true);
      const recommendation = await getFoodRecommendation(dishName, userProfile);
      setFoodRecommendation(recommendation);
    } catch (error) {
      console.log('Không thể load khuyến nghị:', error);
      setFoodRecommendation(null);
    } finally {
      setIsLoadingRecommendation(false);
    }
  };

  const saveToHistory = useCallback(
    async (
      dishName: string,
      confidence: number,
      nutrition: NutritionInfo,
      recommendation: FoodRecommendation | null,
    ) => {
      try {
        const historyItem: Omit<HistoryItem, 'id' | 'timestamp' | 'date'> = {
          foodName: dishName,
          confidence: confidence,
          nutritionInfo: {
            calories: nutrition.calories,
            protein: nutrition.protein,
            carbs: nutrition.carbs,
            fat: nutrition.fat,
            fiber: nutrition.fiber,
            sodium: nutrition.sodium,
            serving_size: nutrition.serving_size,
            description: nutrition.description,
          },
          userMetrics: userMetrics,
          recommendation:
            recommendation?.recommendation || 'Không có khuyến nghị',
          healthScore: recommendation?.health_score || 0,
          imageUri: preview,
          analysis: recommendation
            ? {
                bmi_impact:
                  recommendation.analysis?.bmi_impact || 'Không có thông tin',
                nutrition_balance:
                  recommendation.analysis?.nutrition_balance ||
                  'Không có thông tin',
                meal_timing:
                  recommendation.analysis?.meal_timing || 'Không có thông tin',
              }
            : undefined,
        };

        await HistoryService.saveHistoryItem(historyItem);
        console.log('✅ Đã lưu vào lịch sử:', dishName);
      } catch (error) {
        console.error('❌ Lỗi khi lưu lịch sử:', error);
      }
    },
    [userMetrics, preview],
  );

  const processImage = async (asset: any) => {
    setPreview(asset.uri);
    try {
      setIsBusy(true);
      const prediction = await recognizeDishFromServerWithMeta({
        uri: asset.uri,
        name: asset.fileName || 'photo.jpg',
        type: asset.type || 'image/jpeg',
      });
      const resultData = {
        name: prediction.dishName,
        confidence: prediction.confidence,
      };
      setResult(resultData);

      // Load thông tin dinh dưỡng và khuyến nghị
      await Promise.all([
        loadNutritionInfo(prediction.dishName),
        loadFoodRecommendation(prediction.dishName),
      ]);
    } catch (e: any) {
      Alert.alert('Nhận diện lỗi', e?.message || 'Unknown');
    } finally {
      setIsBusy(false);
    }
  };

  const pickImage = () => {
    setResult(null);
    setNutritionInfo(null);
    setFoodRecommendation(null);
    launchImageLibrary(
      {mediaType: 'photo', selectionLimit: 1},
      async (res: ImagePickerResponse) => {
        if (res.didCancel) {
          return;
        }
        if (res.errorCode) {
          Alert.alert('Lỗi', res.errorMessage || res.errorCode);
          return;
        }
        const asset = res.assets?.[0];
        if (!asset?.uri) {
          return;
        }
        await processImage(asset);
      },
    );
  };

  const capturePhoto = () => {
    setResult(null);
    setNutritionInfo(null);
    setFoodRecommendation(null);
    launchCamera(
      {mediaType: 'photo', saveToPhotos: true},
      async (res: ImagePickerResponse) => {
        if (res.didCancel) {
          return;
        }
        if (res.errorCode) {
          Alert.alert('Lỗi', res.errorMessage || res.errorCode);
          return;
        }
        const asset = res.assets?.[0];
        if (!asset?.uri) {
          return;
        }
        await processImage(asset);
      },
    );
  };

  const renderUserProfileInfo = () => {
    if (!userProfile) return null;
    return <UserProfileCard userProfile={userProfile} />;
  };

  const renderFoodRecommendation = () => {
    if (!foodRecommendation) return null;
    return <FoodRecommendationCard recommendation={foodRecommendation} />;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {renderUserProfileInfo()}

      <View style={styles.buttonsRow}>
        <TouchableOpacity
          disabled={isBusy}
          style={[styles.button, styles.buttonHalf]}
          onPress={pickImage}>
          <Text style={styles.buttonText}>
            {isBusy ? 'Đang nhận diện...' : 'Chọn ảnh'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={isBusy}
          style={[styles.button, styles.buttonHalf]}
          onPress={capturePhoto}>
          <Text style={styles.buttonText}>Chụp ảnh</Text>
        </TouchableOpacity>
      </View>

      {preview && (
        <Image
          source={{uri: preview}}
          style={styles.preview}
          resizeMode="cover"
        />
      )}

      {result && <RecognitionResultCard result={result} />}

      {/* Hiển thị thông tin dinh dưỡng */}
      {isLoadingNutrition && (
        <LoadingCard message="Đang tải thông tin dinh dưỡng..." />
      )}

      {nutritionInfo && (
        <View style={styles.nutritionBox}>
          <Text style={styles.nutritionTitle}>📊 Thông tin dinh dưỡng</Text>
          <NutritionInfoComponent
            nutritionInfo={nutritionInfo}
            userMetrics={userMetrics}
          />
        </View>
      )}

      {/* Hiển thị so sánh dinh dưỡng với nhu cầu cá nhân */}
      {nutritionInfo && userMetrics && (
        <View style={styles.nutritionBox}>
          <NutritionComparisonCard
            nutritionInfo={nutritionInfo}
            userMetrics={userMetrics}
          />
        </View>
      )}

      {/* Hiển thị khuyến nghị dinh dưỡng */}
      {isLoadingRecommendation && (
        <LoadingCard message="Đang tạo khuyến nghị dinh dưỡng..." />
      )}

      {renderFoodRecommendation()}

      {isBusy && <ActivityIndicator style={styles.loading} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16},
  button: {
    backgroundColor: GREEN,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    width: '100%',
  },
  buttonHalf: {
    flex: 1,
  },
  buttonText: {color: '#FFFFFF', fontWeight: 'bold'},
  preview: {width: '100%', height: 260, borderRadius: 12, marginTop: 12},

  nutritionBox: {
    marginTop: 16,
    backgroundColor: GREEN,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nutritionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
    color: '#333',
    textAlign: 'center',
  },
  loading: {marginTop: 12},
});
