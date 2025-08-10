import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

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

interface NutritionInfoComponentProps {
  nutritionInfo: NutritionInfo;
  userMetrics?: {
    daily_calories_target: number;
    daily_protein_target: number;
    daily_carbs_target: number;
    daily_fat_target: number;
  };
}

const NutritionInfoComponent: React.FC<NutritionInfoComponentProps> = ({
  nutritionInfo,
  userMetrics,
}) => {
  const calculatePercentage = (value: number, target: number) => {
    if (!target || target === 0) return 0;
    return Math.round((value / target) * 100);
  };

  const getNutrientColor = (percentage: number) => {
    if (percentage <= 25) return '#28a745'; // Xanh lá - Tốt
    if (percentage <= 50) return '#ffc107'; // Vàng - Vừa phải
    return '#dc3545'; // Đỏ - Cao
  };

  const renderNutrientRow = (
    label: string,
    value: number,
    unit: string,
    target?: number,
    showPercentage: boolean = true,
  ) => {
    const percentage = target ? calculatePercentage(value, target) : 0;
    const color = showPercentage ? getNutrientColor(percentage) : '#333';

    return (
      <View style={styles.nutrientRow}>
        <View style={styles.nutrientLabelContainer}>
          <Text style={styles.nutrientLabel}>{label}</Text>
          {showPercentage && target && (
            <Text style={[styles.percentageText, {color}]}>
              {percentage}%
            </Text>
          )}
        </View>
        <View style={styles.nutrientValueContainer}>
          <Text style={[styles.nutrientValue, {color}]}>
            {value} {unit}
          </Text>
          {showPercentage && target && (
            <Text style={styles.targetText}>/ {target} {unit}</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🍽️ {nutritionInfo.name}</Text>
        <Text style={styles.servingSize}>Khẩu phần: {nutritionInfo.serving_size}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔥 Năng lượng & Macronutrients</Text>
        
        {renderNutrientRow(
          'Calories',
          nutritionInfo.calories,
          'cal',
          userMetrics?.daily_calories_target,
        )}
        {renderNutrientRow(
          'Protein',
          nutritionInfo.protein,
          'g',
          userMetrics?.daily_protein_target,
        )}
        {renderNutrientRow(
          'Carbohydrates',
          nutritionInfo.carbs,
          'g',
          userMetrics?.daily_carbs_target,
        )}
        {renderNutrientRow(
          'Chất béo',
          nutritionInfo.fat,
          'g',
          userMetrics?.daily_fat_target,
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌿 Chất dinh dưỡng khác</Text>
        
        {renderNutrientRow('Chất xơ', nutritionInfo.fiber, 'g', undefined, false)}
        {renderNutrientRow('Natri', nutritionInfo.sodium, 'mg', undefined, false)}
      </View>

      {Object.values(nutritionInfo.vitamins).some(v => v > 0) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💊 Vitamin</Text>
          <View style={styles.vitaminGrid}>
            {Object.entries(nutritionInfo.vitamins).map(([vitamin, value]) => (
              value > 0 && (
                <View key={vitamin} style={styles.vitaminItem}>
                  <Text style={styles.vitaminLabel}>Vitamin {vitamin}</Text>
                  <Text style={styles.vitaminValue}>{value} mg</Text>
                </View>
              )
            ))}
          </View>
        </View>
      )}

      {Object.values(nutritionInfo.minerals).some(m => m > 0) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Khoáng chất</Text>
          <View style={styles.mineralGrid}>
            {Object.entries(nutritionInfo.minerals).map(([mineral, value]) => (
              value > 0 && (
                <View key={mineral} style={styles.mineralItem}>
                  <Text style={styles.mineralLabel}>{mineral.charAt(0).toUpperCase() + mineral.slice(1)}</Text>
                  <Text style={styles.mineralValue}>{value} mg</Text>
                </View>
              )
            ))}
          </View>
        </View>
      )}

      {nutritionInfo.ingredients && nutritionInfo.ingredients.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🥘 Thành phần chính</Text>
          {nutritionInfo.ingredients.map((ingredient, index) => (
            <Text key={index} style={styles.ingredientText}>
              • {ingredient}
            </Text>
          ))}
        </View>
      )}

      {nutritionInfo.description && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Mô tả</Text>
          <Text style={styles.descriptionText}>{nutritionInfo.description}</Text>
        </View>
      )}

      {userMetrics && (
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>📊 Tóm tắt so với nhu cầu hàng ngày</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Calories</Text>
              <Text style={[styles.summaryValue, {color: getNutrientColor(calculatePercentage(nutritionInfo.calories, userMetrics.daily_calories_target))}]}>
                {calculatePercentage(nutritionInfo.calories, userMetrics.daily_calories_target)}%
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Protein</Text>
              <Text style={[styles.summaryValue, {color: getNutrientColor(calculatePercentage(nutritionInfo.protein, userMetrics.daily_protein_target))}]}>
                {calculatePercentage(nutritionInfo.protein, userMetrics.daily_protein_target)}%
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Carbs</Text>
              <Text style={[styles.summaryValue, {color: getNutrientColor(calculatePercentage(nutritionInfo.carbs, userMetrics.daily_carbs_target))}]}>
                {calculatePercentage(nutritionInfo.carbs, userMetrics.daily_carbs_target)}%
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Fat</Text>
              <Text style={[styles.summaryValue, {color: getNutrientColor(calculatePercentage(nutritionInfo.fat, userMetrics.daily_fat_target))}]}>
                {calculatePercentage(nutritionInfo.fat, userMetrics.daily_fat_target)}%
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
    textAlign: 'center',
  },
  servingSize: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },
  nutrientLabelContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nutrientLabel: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  percentageText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#f8f9fa',
  },
  nutrientValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nutrientValue: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  targetText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  vitaminGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  vitaminItem: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
    alignItems: 'center',
  },
  vitaminLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  vitaminValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  mineralGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  mineralItem: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
    alignItems: 'center',
  },
  mineralLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  mineralValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  ingredientText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
    lineHeight: 20,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  summarySection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    width: '48%',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NutritionInfoComponent;
