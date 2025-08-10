import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export interface FoodRecommendationData {
  food_name: string;
  user_metrics: any;
  food_nutrition: any;
  analysis: any;
  recommendation: string;
  detailed_advice: string[];
  health_score: number;
}

interface FoodRecommendationCardProps {
  recommendation: FoodRecommendationData;
}

const FoodRecommendationCard: React.FC<FoodRecommendationCardProps> = ({
  recommendation,
}) => {
  const getRecommendationColor = (rec: string) => {
    if (rec.includes('NÊN ĂN')) return '#28a745';
    if (rec.includes('ĂN VỪA PHẢI')) return '#ffc107';
    if (rec.includes('HẠN CHẾ')) return '#dc3545';
    return '#6c757d';
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return '#28a745';
    if (score >= 60) return '#ffc107';
    return '#dc3545';
  };

  const getHealthScoreText = (score: number) => {
    if (score >= 80) return 'Tuyệt vời';
    if (score >= 60) return 'Tốt';
    return 'Cần cải thiện';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍽️ Khuyến nghị dinh dưỡng</Text>
      
      <View style={styles.foodNameContainer}>
        <Text style={styles.foodName}>{recommendation.food_name}</Text>
      </View>

      <View style={styles.scoreContainer}>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreLabel}>Điểm sức khỏe</Text>
          <Text style={[styles.scoreValue, {color: getHealthScoreColor(recommendation.health_score)}]}>
            {recommendation.health_score}/100
          </Text>
          <Text style={[styles.scoreText, {color: getHealthScoreColor(recommendation.health_score)}]}>
            {getHealthScoreText(recommendation.health_score)}
          </Text>
        </View>
        
        <View style={styles.recommendationItem}>
          <Text style={styles.recommendationLabel}>Khuyến nghị</Text>
          <Text style={[styles.recommendationValue, {color: getRecommendationColor(recommendation.recommendation)}]}>
            {recommendation.recommendation}
          </Text>
        </View>
      </View>

      {recommendation.detailed_advice && recommendation.detailed_advice.length > 0 && (
        <View style={styles.adviceContainer}>
          <Text style={styles.adviceTitle}>💡 Lời khuyên chi tiết</Text>
          {recommendation.detailed_advice.map((advice, index) => (
            <View key={index} style={styles.adviceItem}>
              <Text style={styles.adviceBullet}>•</Text>
              <Text style={styles.adviceText}>{advice}</Text>
            </View>
          ))}
        </View>
      )}

      {recommendation.analysis && (
        <View style={styles.analysisContainer}>
          <Text style={styles.analysisTitle}>📊 Phân tích</Text>
          <View style={styles.analysisGrid}>
            {Object.entries(recommendation.analysis).map(([key, value]) => (
              <View key={key} style={styles.analysisItem}>
                <Text style={styles.analysisLabel}>{key}</Text>
                <Text style={styles.analysisValue}>{String(value)}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
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
    marginBottom: 16,
    textAlign: 'center',
  },
  foodNameContainer: {
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  scoreItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  recommendationItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
    fontWeight: '500',
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '500',
  },
  recommendationLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
    fontWeight: '500',
  },
  recommendationValue: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  adviceContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  adviceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 8,
  },
  adviceItem: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'flex-start',
  },
  adviceBullet: {
    fontSize: 16,
    color: '#2E7D32',
    marginRight: 8,
    marginTop: 2,
  },
  adviceText: {
    fontSize: 13,
    color: '#495057',
    flex: 1,
    lineHeight: 18,
  },
  analysisContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  analysisTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 8,
  },
  analysisGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  analysisItem: {
    width: '48%',
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
    padding: 6,
    borderRadius: 6,
  },
  analysisLabel: {
    fontSize: 11,
    color: '#6c757d',
    marginBottom: 2,
    fontWeight: '500',
  },
  analysisValue: {
    fontSize: 12,
    color: '#212529',
    fontWeight: 'bold',
  },
});

export default FoodRecommendationCard;
