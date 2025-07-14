# YouTube Clone - Server API

## 🚀 Chức năng chính

### 🔐 Authentication
- Đăng ký/Đăng nhập với email
- Đăng nhập bằng Google OAuth
- JWT token authentication
- Cookie-based session

### 👥 User Management
- CRUD thông tin người dùng
- Upload avatar/background
- Tìm kiếm người dùng
- Quản lý kênh

### 📹 Video Management
- Upload video (Cloudinary/Google Drive)
- CRUD video với metadata
- Phân loại video (short/long)
- Thumbnail generation
- Video categories & tags

### 💬 Comments & Interactions
- Comment và reply comment
- Like/Dislike video & comment
- Nested comment system
- Comment moderation

### 📺 Channel & Subscription
- Subscribe/Unsubscribe channels
- Channel management
- Subscriber count
- Channel playlists

### 📋 Playlist Management
- Tạo/sửa/xóa playlist
- Thêm/xóa video khỏi playlist
- Public/Private playlist
- Playlist sharing

### 🔔 Notifications
- Real-time notifications
- Like, comment, subscribe notifications
- Notification status tracking

### 📊 Analytics & History
- Video view tracking
- Watch history
- Trending videos algorithm
- Video recommendations

### 🗂️ File Management
- Cloudinary integration
- Google Drive upload
- Image/Video/Audio processing
- File optimization

## 🔧 Cấu hình Environment Variables

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=mongodb://localhost:27017/youtube-clone

# JWT Secrets
PASSJWT=your_jwt_secret_key
SESSION_SECRET=your_session_secret

# Frontend URL
FRONT_END_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Cloudinary Configuration
YOUR_CLOUD_NAME=your_cloudinary_cloud_name
YOUR_API_KEY=your_cloudinary_api_key
YOUR_API_SECRET=your_cloudinary_api_secret

# Google Drive Configuration
CLIENT_EMAIL=your_service_account_email
PRIVATE_KEY=your_private_key
DRIVE_FOLDER_ID=your_drive_folder_id

# Swagger URLs
SWAGGER_URL_DEV=http://localhost:5000
SWAGGER_URL_TEST=https://your-test-domain.com
```

## 🛠️ Cài đặt

```bash
# Cài đặt dependencies
npm install

# Build TypeScript
npm run build

# Chạy development
npm run dev

# Chạy production
npm start
```

## 📚 API Documentation

- Swagger UI: `http://localhost:5000/api-docs`
- Base URL: `http://localhost:5000/api`

## 🏗️ Kiến trúc

- **Framework**: Express.js + TypeScript
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + Passport.js
- **File Storage**: Cloudinary + Google Drive
- **Documentation**: Swagger/OpenAPI
- **Cron Jobs**: Node-cron
- **Rate Limiting**: Express-rate-limit

## 🔄 Cron Jobs

- Tự động xóa lịch sử xem video cũ (3 ngày)

## 🚧 Đang cập nhật thêm...
