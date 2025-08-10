# API Client Services

## Tổng quan

Thư mục này chứa các service để tương tác với API, sử dụng `apiClient.ts` làm HTTP client dùng chung.

## Files

### `apiClient.ts`
File chính chứa cấu hình axios dùng chung cho tất cả service:

- **serverClient**: Axios instance để gọi server nội bộ FastAPI
- **thirdPartyClient**: Axios instance để gọi third-party API (Clarifai)
- **createFormData()**: Helper function để tạo FormData
- **handleApiError()**: Helper function để xử lý lỗi API

### `nutritionService.ts`
Service để lấy thông tin dinh dưỡng từ server:

- `getNutritionInfo(dishName)`: Lấy thông tin dinh dưỡng chi tiết
- `getNutritionSummary(foodKey)`: Lấy tóm tắt dinh dưỡng
- `getHealthScore(foodKey)`: Lấy điểm sức khỏe
- `searchFoods(query)`: Tìm kiếm món ăn

### `foodRecognition.ts`
Service để nhận diện món ăn:

- `recognizeDishFromServerWithMeta()`: Nhận diện từ server với metadata
- `recognizeDishFromServer()`: Nhận diện từ server theo filePath
- `recognizeDishClarifaiFromFile()`: Nhận diện từ Clarifai API
- `recognizeDishFromBase64()`: Nhận diện từ base64
- `recognizeDishFromFile()`: Nhận diện từ file

## Cách sử dụng

### Import và sử dụng serverClient

```typescript
import {serverClient} from './apiClient';

// GET request
const response = await serverClient.get('/nutrition/analyze/banh_my');
const data = response.data;

// POST request với FormData
const formData = createFormData({file: imageFile});
const response = await serverClient.post('/predict', formData, {
  headers: {'Content-Type': 'multipart/form-data'},
});
```

### Import và sử dụng thirdPartyClient

```typescript
import {thirdPartyClient} from './apiClient';

// POST request (auth headers được tự động thêm)
const response = await thirdPartyClient.post('', payload);
```

### Sử dụng helper functions

```typescript
import {createFormData, handleApiError} from './apiClient';

// Tạo FormData
const form = createFormData({
  name: 'test',
  file: imageFile,
});

// Xử lý lỗi
try {
  // API call
} catch (error) {
  const errorMessage = handleApiError(error, 'Lỗi mặc định');
  console.error(errorMessage);
}
```

## Tính năng

- **Automatic logging**: Tự động log tất cả request/response
- **Error handling**: Xử lý lỗi mạng và HTTP một cách nhất quán
- **Timeout**: Timeout mặc định 15 giây
- **Auth headers**: Tự động thêm auth headers cho third-party API
- **FormData support**: Hỗ trợ tạo FormData cho file upload
- **Type safety**: Hỗ trợ TypeScript đầy đủ

## Cấu hình

Các URL và token được cấu hình trong `../config.ts`:

- `SERVER_BASE_URL`: URL của server FastAPI nội bộ
- `THIRD_PARTY_ENDPOINT`: URL của Clarifai API
- `THIRD_PARTY_AUTH_TOKEN`: Token xác thực Clarifai
