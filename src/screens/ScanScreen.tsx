import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Image} from 'react-native';
import {launchImageLibrary, ImagePickerResponse} from 'react-native-image-picker';
import {recognizeDishFromServerWithMeta} from '../services/foodRecognition';

const GREEN = '#2E7D32';

export default function ScanScreen(): React.JSX.Element {
  const [isBusy, setIsBusy] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const [result, setResult] = useState<{name: string; confidence?: number} | null>(null);

  const pickImage = () => {
    setResult(null);
    launchImageLibrary({mediaType: 'photo', selectionLimit: 1}, async (res: ImagePickerResponse) => {
      if (res.didCancel) return;
      if (res.errorCode) {
        Alert.alert('Lỗi', res.errorMessage || res.errorCode);
        return;
      }
      const asset = res.assets?.[0];
      if (!asset?.uri) return;
      setPreview(asset.uri);
      try {
        setIsBusy(true);
        const prediction = await recognizeDishFromServerWithMeta({
          uri: asset.uri,
          name: asset.fileName || 'photo.jpg',
          type: asset.type || 'image/jpeg',
        });
        setResult({name: prediction.dishName, confidence: prediction.confidence});
      } catch (e: any) {
        Alert.alert('Nhận diện lỗi', e?.message || 'Unknown');
      } finally {
        setIsBusy(false);
      }
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity disabled={isBusy} style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>{isBusy ? 'Đang nhận diện...' : 'Chọn ảnh từ thư viện'}</Text>
      </TouchableOpacity>

      {preview && (
        <Image source={{uri: preview}} style={styles.preview} resizeMode="cover" />)
      }

      {result && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Kết quả:</Text>
          <Text style={styles.resultText}>Món: {result.name}</Text>
          {typeof result.confidence === 'number' && (
            <Text style={styles.resultText}>Độ tin cậy: {(result.confidence * 100).toFixed(1)}%</Text>
          )}
        </View>
      )}

      {isBusy && <ActivityIndicator style={{marginTop: 12}} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  button: { backgroundColor: GREEN, padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  buttonText: { color: '#FFFFFF', fontWeight: 'bold' },
  preview: { width: '100%', height: 260, borderRadius: 12, marginTop: 12 },
  resultBox: { marginTop: 16, backgroundColor: GREEN, padding: 12, borderRadius: 8 },
  resultTitle: { fontWeight: 'bold', marginBottom: 6 },
  resultText: { fontSize: 16 },
});
