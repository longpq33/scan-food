# 🍽️ ScanFood - Ứng dụng phân tích dinh dưỡng thông minh

## 📱 Mô tả

ScanFood là một ứng dụng React Native giúp người dùng:
- Nhập thông tin cá nhân để tính toán BMI, BMR, TDEE
- Chụp ảnh món ăn và nhận diện bằng AI
- Phân tích dinh dưỡng của món ăn
- So sánh với nhu cầu cá nhân
- Đưa ra khuyến nghị dinh dưỡng chi tiết

## 🚀 Tính năng chính

### 1. **Tab Profile** - Quản lý thông tin cá nhân
- Nhập chiều cao, cân nặng, tuổi, giới tính
- Chọn mức độ vận động (ít vận động → rất nhiều)
- Chọn mục tiêu (giảm cân, duy trì, tăng cân)
- Tính toán tự động:
  - **BMI** (Body Mass Index)
  - **BMR** (Basal Metabolic Rate)
  - **TDEE** (Total Daily Energy Expenditure)
  - Mục tiêu dinh dưỡng hàng ngày (calories, protein, carbs, fat)

### 2. **Tab Scan** - Nhận diện và phân tích món ăn
- Chụp ảnh món ăn hoặc chọn từ thư viện
- AI nhận diện món ăn Việt Nam với độ tin cậy cao
- Hiển thị thông tin dinh dưỡng chi tiết:
  - Calories, protein, carbs, fat, fiber, sodium
  - Vitamin (A, C, B1, B2, B6, B12)
  - Khoáng chất (sắt, canxi, kẽm, kali, magie)
- **Khuyến nghị dinh dưỡng cá nhân hóa**:
  - So sánh với nhu cầu hàng ngày
  - Điểm sức khỏe (0-100)
  - Khuyến nghị: NÊN ĂN / ĂN VỪA PHẢI / HẠN CHẾ
  - Lời khuyên chi tiết dựa trên mục tiêu

### 3. **Tab History** - Lịch sử quét
- Lưu trữ các món ăn đã quét
- Hiển thị kết quả nhận diện, dinh dưỡng và khuyến nghị
- Xóa lịch sử khi cần

### 4. **Tab Home** - Hướng dẫn sử dụng
- Tổng quan về các tính năng
- Hướng dẫn sử dụng nhanh
- Thông tin về app

## 🏗️ Kiến trúc ứng dụng

### Frontend (React Native)
```
ScanFoodApp/
├── src/
│   ├── components/
│   │   ├── NutritionInfo.tsx          # Hiển thị thông tin dinh dưỡng
│   │   ├── UserProfileCard.tsx        # Card thông tin người dùng
│   │   ├── FoodRecommendationCard.tsx # Card khuyến nghị dinh dưỡng
│   │   ├── RecognitionResultCard.tsx  # Card kết quả nhận diện
│   │   └── LoadingCard.tsx            # Component loading
│   ├── screens/
│   │   ├── ScanScreen.tsx             # Màn hình chính quét và phân tích
│   │   ├── UserProfileScreen.tsx      # Màn hình thông tin cá nhân
│   │   ├── HistoryScreen.tsx          # Màn hình lịch sử
│   │   └── HomeScreen.tsx             # Màn hình chủ
│   └── services/
│       ├── apiClient.ts               # Client API
│       ├── foodRecognition.ts         # Service nhận diện món ăn
│       └── nutritionService.ts        # Service dinh dưỡng
```

### Backend (FastAPI)
```
server/
├── app/
│   ├── main.py                        # API endpoints chính
│   ├── schemas.py                     # Pydantic models
│   ├── user_health_calculator.py      # Tính toán BMI, BMR, TDEE
│   └── food_recommendation_service.py # Phân tích và khuyến nghị
```

## 🔧 Cài đặt và chạy

### Backend
```bash
cd server
# Tạo virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# hoặc
venv\Scripts\activate     # Windows

# Cài đặt dependencies
pip install -r requirements.txt

# Chạy server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend
```bash
cd ScanFoodApp
# Cài đặt dependencies
npm install

# Chạy app (Android)
npx react-native run-android

# Chạy app (iOS)
npx react-native run-ios
```

## 📊 API Endpoints

### 1. Nhận diện món ăn
```
POST /predict
- Input: Ảnh món ăn
- Output: Tên món, độ tin cậy
```

### 2. Thông tin dinh dưỡng
```
GET /nutrition/{food_name}
- Input: Tên món ăn
- Output: Thông tin dinh dưỡng chi tiết
```

### 3. Phân tích cơ thể
```
POST /nutrition/analyze-body
- Input: Thông tin cá nhân (height, weight, age, gender, activity_level, goal)
- Output: BMI, BMR, TDEE, mục tiêu dinh dưỡng
```

### 4. Khuyến nghị dinh dưỡng
```
POST /nutrition/food-recommendation
- Input: Tên món ăn + thông tin cá nhân
- Output: Khuyến nghị, điểm sức khỏe, lời khuyên chi tiết
```

## 🎯 Cách sử dụng

### Bước 1: Cập nhật thông tin cá nhân
1. Vào tab **Profile**
2. Nhập chiều cao, cân nặng, tuổi, giới tính
3. Chọn mức độ vận động và mục tiêu
4. Hệ thống tự động tính toán BMI, BMR, TDEE

### Bước 2: Quét món ăn
1. Vào tab **Scan**
2. Chụp ảnh món ăn hoặc chọn từ thư viện
3. Chờ AI nhận diện (5-10 giây)
4. Xem kết quả nhận diện và thông tin dinh dưỡng

### Bước 3: Xem khuyến nghị
1. Sau khi nhận diện, hệ thống tự động tạo khuyến nghị
2. So sánh dinh dưỡng món ăn với nhu cầu cá nhân
3. Xem điểm sức khỏe và lời khuyên chi tiết

### Bước 4: Theo dõi lịch sử
1. Vào tab **History** để xem các món đã quét
2. Xem lại khuyến nghị và dinh dưỡng
3. Xóa lịch sử khi cần

## 🔍 Ví dụ sử dụng

### Kịch bản 1: Người muốn giảm cân
- **Mục tiêu**: Giảm cân
- **Quét món**: Phở bò
- **Kết quả**: 
  - Điểm sức khỏe: 85/100
  - Khuyến nghị: NÊN ĂN
  - Lý do: Protein cao, carbs vừa phải, phù hợp với mục tiêu giảm cân

### Kịch bản 2: Người muốn tăng cân
- **Mục tiêu**: Tăng cân
- **Quét món**: Bánh mì trứng
- **Kết quả**:
  - Điểm sức khỏe: 78/100
  - Khuyến nghị: NÊN ĂN
  - Lý do: Calories và carbs cao, giúp tăng cân lành mạnh

## 🛠️ Công nghệ sử dụng

- **Frontend**: React Native, TypeScript
- **Backend**: FastAPI, Python
- **AI Model**: Hugging Face Transformers
- **Database**: SQLite (có thể nâng cấp lên PostgreSQL)
- **Image Processing**: Pillow, OpenCV
- **API**: RESTful API với Pydantic validation

## 📈 Tính năng tương lai

- [ ] Lưu trữ dữ liệu người dùng (AsyncStorage/SQLite)
- [ ] Đồng bộ dữ liệu với server
- [ ] Thống kê dinh dưỡng theo thời gian
- [ ] Gợi ý món ăn dựa trên mục tiêu
- [ ] Tích hợp với thiết bị đeo tay
- [ ] Hỗ trợ đa ngôn ngữ
- [ ] Dark mode

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Hãy:
1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📄 License

MIT License - xem file LICENSE để biết thêm chi tiết.

## 📞 Liên hệ

- **Email**: support@scanfood.app
- **Website**: https://scanfood.app
- **GitHub**: https://github.com/scanfood/scanfood-app

---

**ScanFood** - Giúp bạn ăn uống thông minh, sống khỏe mạnh! 🥗✨
