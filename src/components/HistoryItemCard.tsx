import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {HistoryItem} from '../services/historyService';

const GREEN = '#2E7D32';
const ORANGE = '#FF9800';
const RED = '#F44336';

interface HistoryItemCardProps {
  item: HistoryItem;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete?: () => void;
}

const HistoryItemCard: React.FC<HistoryItemCardProps> = ({
  item,
  isExpanded,
  onToggle,
  onDelete,
}) => {
  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return GREEN;
    if (score >= 60) return ORANGE;
    return RED;
  };

  const getRecommendationColor = (recommendation: string) => {
    if (recommendation.includes('NÊN')) return GREEN;
    if (recommendation.includes('VỪA PHẢI')) return ORANGE;
    return RED;
  };

  const formatConfidence = (confidence: number) => {
    return Math.round(confidence * 100);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onToggle}>
      <View style={styles.header}>
        <View style={styles.foodInfo}>
          <Text style={styles.foodName}>{item.foodName}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
        <View style={styles.scoreContainer}>
          <Text style={[styles.healthScore, {color: getHealthScoreColor(item.healthScore)}]}>
            {item.healthScore}%
          </Text>
          <Text style={styles.confidence}>
            {formatConfidence(item.confidence)}% chính xác
          </Text>
        </View>
      </View>

      <View style={styles.recommendationContainer}>
        <Text style={[styles.recommendation, {color: getRecommendationColor(item.recommendation)}]}>
          {item.recommendation}
        </Text>
      </View>

      {isExpanded && (
        <View style={styles.expandedContent}>
          {/* Thông tin dinh dưỡng */}
          <View style={styles.nutritionSection}>
            <Text style={styles.sectionTitle}>🍽️ Thông tin dinh dưỡng</Text>
            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{item.nutritionInfo.calories}</Text>
                <Text style={styles.nutritionLabel}>Calories</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{item.nutritionInfo.protein}g</Text>
                <Text style={styles.nutritionLabel}>Protein</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{item.nutritionInfo.carbs}g</Text>
                <Text style={styles.nutritionLabel}>Carbs</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{item.nutritionInfo.fat}g</Text>
                <Text style={styles.nutritionLabel}>Fat</Text>
              </View>
            </View>
          </View>

          {/* Thông tin bổ sung */}
          {(item.nutritionInfo.fiber || item.nutritionInfo.sodium || item.nutritionInfo.serving_size) && (
            <View style={styles.additionalSection}>
              <Text style={styles.sectionTitle}>📋 Thông tin bổ sung</Text>
              <View style={styles.additionalGrid}>
                {item.nutritionInfo.fiber && (
                  <View style={styles.additionalItem}>
                    <Text style={styles.additionalLabel}>Chất xơ:</Text>
                    <Text style={styles.additionalValue}>{item.nutritionInfo.fiber}g</Text>
                  </View>
                )}
                {item.nutritionInfo.sodium && (
                  <View style={styles.additionalItem}>
                    <Text style={styles.additionalLabel}>Natri:</Text>
                    <Text style={styles.additionalValue}>{item.nutritionInfo.sodium}mg</Text>
                  </View>
                )}
                {item.nutritionInfo.serving_size && (
                  <View style={styles.additionalItem}>
                    <Text style={styles.additionalLabel}>Khẩu phần:</Text>
                    <Text style={styles.additionalValue}>{item.nutritionInfo.serving_size}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Mô tả */}
          {item.nutritionInfo.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>📝 Mô tả</Text>
              <Text style={styles.description}>{item.nutritionInfo.description}</Text>
            </View>
          )}

          {/* Phân tích */}
          {item.analysis && (
            <View style={styles.analysisSection}>
              <Text style={styles.sectionTitle}>🔍 Phân tích</Text>
              <View style={styles.analysisGrid}>
                <View style={styles.analysisItem}>
                  <Text style={styles.analysisLabel}>Tác động BMI:</Text>
                  <Text style={styles.analysisValue}>{item.analysis.bmi_impact}</Text>
                </View>
                <View style={styles.analysisItem}>
                  <Text style={styles.analysisLabel}>Cân bằng dinh dưỡng:</Text>
                  <Text style={styles.analysisValue}>{item.analysis.nutrition_balance}</Text>
                </View>
                <View style={styles.analysisItem}>
                  <Text style={styles.analysisLabel}>Thời điểm ăn:</Text>
                  <Text style={styles.analysisValue}>{item.analysis.meal_timing}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Nút xóa */}
          {onDelete && (
            <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
              <Text style={styles.deleteButtonText}>🗑️ Xóa</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  healthScore: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  confidence: {
    fontSize: 10,
    color: '#666',
  },
  recommendationContainer: {
    marginBottom: 12,
  },
  recommendation: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
  },
  expandedContent: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  nutritionSection: {
    marginBottom: 20,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    alignItems: 'center',
    flex: 1,
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: GREEN,
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  additionalSection: {
    marginBottom: 20,
  },
  additionalGrid: {
    gap: 8,
  },
  additionalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  additionalLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  additionalValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  descriptionSection: {
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  analysisSection: {
    marginBottom: 20,
  },
  analysisGrid: {
    gap: 8,
  },
  analysisItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  analysisLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  analysisValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 16,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default HistoryItemCard;
