import {
  serverClient,
  thirdPartyClient,
  createFormData,
  handleApiError,
} from './apiClient';
import * as RNFS from 'react-native-fs';

export interface RecognitionResult {
  dishName: string;
  confidence?: number;
}

// Gọi server nội bộ FastAPI (kèm metadata để xử lý content:// trên thiết bị thật)
export async function recognizeDishFromServerWithMeta(params: {
  uri: string;
  name?: string;
  type?: string;
}): Promise<RecognitionResult> {
  const {uri, name, type} = params;
  const form = createFormData({
    file: {
      uri,
      name: name || 'photo.jpg',
      type: type || 'image/jpeg',
    },
  });

  try {
    const res = await serverClient.post('/predict', form, {
      headers: {'Content-Type': 'multipart/form-data'},
    });
    return {
      dishName: res.data?.dish_name || 'Unknown',
      confidence: res.data?.confidence,
    };
  } catch (error) {
    console.error('Error recognizing dish from server:', error);
    throw new Error(handleApiError(error, 'Không thể nhận diện món ăn'));
  }
}

// Gọi server nội bộ FastAPI (giữ bản cũ theo filePath)
export async function recognizeDishFromServer(
  filePath: string,
): Promise<RecognitionResult> {
  const form = createFormData({
    file: {
      uri: filePath.startsWith('file://') ? filePath : `file://${filePath}`,
      name: 'photo.jpg',
      type: 'image/jpeg',
    },
  });

  try {
    const res = await serverClient.post('/predict', form, {
      headers: {'Content-Type': 'multipart/form-data'},
    });
    return {
      dishName: res.data?.dish_name || 'Unknown',
      confidence: res.data?.confidence,
    };
  } catch (error) {
    console.error('Error recognizing dish from server:', error);
    throw new Error(handleApiError(error, 'Không thể nhận diện món ăn'));
  }
}

// Clarifai: gửi base64
export async function recognizeDishClarifaiFromFile(
  filePath: string,
): Promise<RecognitionResult> {
  try {
    const base64 = await RNFS.readFile(filePath, 'base64');
    const payload = {inputs: [{data: {image: {base64}}}]};

    const res = await thirdPartyClient.post('', payload);
    const concepts = res.data?.outputs?.[0]?.data?.concepts || [];

    if (concepts.length > 0) {
      return {dishName: concepts[0].name, confidence: concepts[0].value};
    }
    return {dishName: 'Unknown', confidence: 0};
  } catch (error) {
    console.error('Error recognizing dish from Clarifai:', error);
    return {dishName: 'Unknown', confidence: 0};
  }
}

export async function recognizeDishFromBase64(
  base64Image: string,
): Promise<RecognitionResult> {
  try {
    const res = await thirdPartyClient.post('', {image: base64Image});
    return {
      dishName: res.data?.dishName || 'Unknown',
      confidence: res.data?.confidence,
    };
  } catch (error) {
    console.error('Error recognizing dish from base64:', error);
    return {dishName: 'Grilled Chicken Salad', confidence: 0.86};
  }
}

export async function recognizeDishFromFile(
  filePath: string,
): Promise<RecognitionResult> {
  try {
    const form = createFormData({
      file: {
        uri: filePath.startsWith('file://') ? filePath : `file://${filePath}`,
        name: 'photo.jpg',
        type: 'image/jpeg',
      },
    });

    const res = await thirdPartyClient.post('', form, {
      headers: {'Content-Type': 'multipart/form-data'},
    });

    return {
      dishName: res.data?.dishName || 'Unknown',
      confidence: res.data?.confidence,
    };
  } catch (error) {
    console.error('Error recognizing dish from file:', error);
    return {dishName: 'Grilled Chicken Salad', confidence: 0.86};
  }
}
