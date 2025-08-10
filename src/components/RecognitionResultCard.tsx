import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface RecognitionResultData {
  name: string;
  confidence?: number;
}

interface RecognitionResultCardProps {
  result: RecognitionResultData;
}

const RecognitionResultCard: React.FC<RecognitionResultCardProps> = ({result}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍽️ Kết quả nhận diện</Text>
      
      <View style={styles.resultContainer}>
        <View style={styles.foodNameContainer}>
          <Text style={styles.foodName}>{result.name}</Text>
        </View>
        
        {typeof result.confidence === 'number' && (
          <View style={styles.confidenceContainer}>
            <Text style={styles.confidenceLabel}>Độ tin cậy</Text>
            <Text style={styles.confidenceValue}>
              {(result.confidence * 100).toFixed(1)}%
            </Text>
            <View style={styles.confidenceBar}>
              <View 
                style={[
                  styles.confidenceFill, 
                  {width: `${result.confidence * 100}%`}
                ]} 
              />
            </View>
          </View>
        )}
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
    marginBottom: 16,
    textAlign: 'center',
  },
  resultContainer: {
    alignItems: 'center',
  },
  foodNameContainer: {
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#c8e6c9',
    minWidth: '80%',
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  confidenceContainer: {
    alignItems: 'center',
    width: '100%',
  },
  confidenceLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
    fontWeight: '500',
  },
  confidenceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  confidenceBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: '#2E7D32',
    borderRadius: 4,
  },
});

export default RecognitionResultCard;
