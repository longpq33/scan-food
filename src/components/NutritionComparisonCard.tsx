import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface NutritionComparisonCardProps {
  nutritionInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  userMetrics: {
    daily_calories_target: number;
    daily_protein_target: number;
    daily_carbs_target: number;
    daily_fat_target: number;
  };
}

const NutritionComparisonCard: React.FC<NutritionComparisonCardProps> = ({
  nutritionInfo,
  userMetrics,
}) => {
  const calculatePercentage = (value: number, target: number) => {
    if (!target || target === 0) {
      return 0;
    }
    return Math.round((value / target) * 100);
  };

  const getNutrientColor = (percentage: number) => {
    if (percentage <= 25) {
      return '#28a745'; // Xanh lá - Tốt
    }
    if (percentage <= 50) {
      return '#ffc107'; // Vàng - Vừa phải
    }
    if (percentage <= 75) {
      return '#fd7e14'; // Cam - Cao
    }
    return '#dc3545'; // Đỏ - Rất cao
  };

  const getNutrientStatus = (percentage: number) => {
    if (percentage <= 25) {
      return 'Tốt';
    }
    if (percentage <= 50) {
      return 'Vừa phải';
    }
    if (percentage <= 75) {
      return 'Cao';
    }
    return 'Rất cao';
  };

  const renderNutrientComparison = (
    label: string,
    value: number,
    unit: string,
    target: number,
    _nutrientKey: string,
  ) => {
    const percentage = calculatePercentage(value, target);
    const color = getNutrientColor(percentage);
    const status = getNutrientStatus(percentage);

    return (
      <View style={styles.nutrientRow}>
        <View style={styles.nutrientInfo}>
          <Text style={styles.nutrientLabel}>{label}</Text>
          <Text style={styles.nutrientUnit}>{unit}</Text>
        </View>

        <View style={styles.nutrientValues}>
          <Text style={styles.currentValue}>{value}</Text>
          <Text style={styles.separator}>/</Text>
          <Text style={styles.targetValue}>{target}</Text>
        </View>

        <View style={styles.percentageContainer}>
          <Text style={[styles.percentageText, {color}]}>{percentage}%</Text>
          <Text style={[styles.statusText, {color}]}>{status}</Text>
        </View>

        <View style={[styles.progressBar, {backgroundColor: '#f0f0f0'}]}>
          <View
            style={[
              styles.progressFill,
              {backgroundColor: color, width: `${Math.min(percentage, 100)}%`},
            ]}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 So sánh với nhu cầu hàng ngày</Text>

      <View style={styles.comparisonContainer}>
        {renderNutrientComparison(
          'Calories',
          nutritionInfo.calories,
          'cal',
          userMetrics.daily_calories_target,
          'calories',
        )}

        {renderNutrientComparison(
          'Protein',
          nutritionInfo.protein,
          'g',
          userMetrics.daily_protein_target,
          'protein',
        )}

        {renderNutrientComparison(
          'Carbohydrates',
          nutritionInfo.carbs,
          'g',
          userMetrics.daily_carbs_target,
          'carbs',
        )}

        {renderNutrientComparison(
          'Chất béo',
          nutritionInfo.fat,
          'g',
          userMetrics.daily_fat_target,
          'fat',
        )}
      </View>

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>🎯 Tóm tắt</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Tổng calo</Text>
            <Text style={styles.summaryValue}>
              {calculatePercentage(
                nutritionInfo.calories,
                userMetrics.daily_calories_target,
              )}
              %
            </Text>
            <Text style={styles.summaryDescription}>của nhu cầu hàng ngày</Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Cân bằng</Text>
            <Text style={styles.summaryValue}>
              {calculatePercentage(
                nutritionInfo.calories,
                userMetrics.daily_calories_target,
              ) <= 30
                ? 'Tốt'
                : 'Cần chú ý'}
            </Text>
            <Text style={styles.summaryDescription}>dinh dưỡng</Text>
          </View>
        </View>
      </View>

      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>💡 Lời khuyên</Text>
        <Text style={styles.tipText}>
          • Món ăn này cung cấp{' '}
          {calculatePercentage(
            nutritionInfo.calories,
            userMetrics.daily_calories_target,
          )}{' '}
          % nhu cầu calo hàng ngày
        </Text>
        <Text style={styles.tipText}>
          • Protein:{' '}
          {calculatePercentage(
            nutritionInfo.protein,
            userMetrics.daily_protein_target,
          )}
          % nhu cầu
        </Text>
        <Text style={styles.tipText}>
          • Carbs:{' '}
          {calculatePercentage(
            nutritionInfo.carbs,
            userMetrics.daily_carbs_target,
          )}
          % nhu cầu
        </Text>
        <Text style={styles.tipText}>
          • Chất béo:{' '}
          {calculatePercentage(nutritionInfo.fat, userMetrics.daily_fat_target)}
          % nhu cầu
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 16,
    textAlign: 'center',
  },
  comparisonContainer: {
    marginBottom: 16,
  },
  nutrientRow: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  nutrientInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nutrientLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  nutrientUnit: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  nutrientValues: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  currentValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  separator: {
    fontSize: 16,
    color: '#666',
    marginHorizontal: 8,
  },
  targetValue: {
    fontSize: 16,
    color: '#666',
  },
  percentageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  percentageText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  summaryContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
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
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  summaryDescription: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
    lineHeight: 12,
  },
  tipsContainer: {
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#2E7D32',
    marginBottom: 6,
    lineHeight: 20,
  },
});

export default NutritionComparisonCard;
