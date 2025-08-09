# ScanFoodApp

Ứng dụng React Native quét món ăn (NutriScan) cho phép chọn ảnh/thực hiện quét để nhận diện món và trả về tên món cùng độ tin cậy. Frontend giao tiếp với backend FastAPI (Python) để suy luận mô hình (PyTorch).

### Công nghệ sử dụng
- **Frontend (React Native)**:
  - **React Native 0.73** (React 18)
  - **TypeScript**
  - **axios**: gọi API
  - **react-native-image-picker**: chọn ảnh từ thư viện/chụp ảnh
  - **react-native-vision-camera**: (đã tích hợp sẵn cho nâng cấp quét thời gian thực sau này)
  - **react-native-fs**: xử lý file/base64 khi cần
- **Backend (Python FastAPI)**:
  - **FastAPI**, **Uvicorn**
  - **PyTorch**, **Torchvision** (Transfer Learning MobileNetV3)
  - Endpoint: `/predict` nhận `multipart/form-data` (ảnh) và trả tên món + độ tin cậy

### Yêu cầu hệ thống
- Node.js >= 18, npm
- Android SDK (Android Studio) để chạy Android
- (Tùy chọn) Xcode để chạy iOS

### Cấu hình API backend
- Sửa địa chỉ server trong `src/config.ts`:
  ```ts
  export const SERVER_BASE_URL = 'http://<LAN_IP_CUA_BAN>:8000';
  // Android emulator: http://10.0.2.2:8000
  // iOS simulator:   http://localhost:8000
  ```
- Lưu ý thiết bị thật: dùng IP LAN của máy chạy server (không dùng localhost).

### Cài đặt và chạy Frontend
```bash
cd ScanFoodApp
npm install

# Chạy Metro bundler (nên mở cửa sổ riêng)
npm start

# Chạy Android (thiết bị thật hoặc emulator)
npm run android

# Kiểm tra lint
npm run lint
```

### Build APK (Release)
```bash
cd android
./gradlew assembleRelease
# APK tạo tại: android/app/build/outputs/apk/release/app-release.apk
```

### Chạy Backend (tham khảo thư mục `server` ở cùng cấp)
```bash
cd ../server
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Chạy server (port 8000)
PYTHONPATH=. .venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Kiểm tra
curl http://localhost:8000/health
```

### Quyền & mạng (Android)
- Đã khai báo quyền `INTERNET`, `CAMERA`, `READ_MEDIA_IMAGES` trong `AndroidManifest.xml`.
- Đã bật cleartext HTTP cho IP LAN qua `res/xml/network_security_config.xml`.
- Nếu gọi API thất bại trên thiết bị thật, kiểm tra:
  - `SERVER_BASE_URL` trỏ đúng IP LAN
  - Thiết bị và máy cùng mạng
  - Server đang chạy và truy cập được từ thiết bị

### Tham khảo endpoint
- `GET /health`: kiểm tra trạng thái server
- `POST /predict`: form-data `file=<ảnh>` ⇒ `{ dishName, confidence }`

### Ghi chú phát triển
- Sau khi thay đổi native/Gradle, nên chạy lại: `cd android && ./gradlew clean`
- Khi gặp lỗi Metro: `npm start -- --reset-cache`
