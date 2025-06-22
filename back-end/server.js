require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const sequelize = require('./config/db');
const authRoutes = require('./routes/auth.route');

const app = express();

// 1. Cấu hình CORS chi tiết
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 2. Middleware bảo mật
app.use(helmet());
app.use(bodyParser.json({ limit: '10kb' }));

// 3. Giới hạn request rate
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100 // giới hạn mỗi IP 100 requests
});
app.use('/api/', limiter);

// 4. Kết nối database
async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ Kết nối database thành công');
    
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
      console.log('🔄 Database đã đồng bộ (alter)');
    }
  } catch (error) {
    console.error('❌ Lỗi database:', error);
    process.exit(1); // Thoát nếu không kết nối được database
  }
}

// 5. Routes
app.use('/api/auth', authRoutes);

// 6. Route kiểm tra sức khỏe
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// 7. Xử lý lỗi tập trung
app.use((err, req, res, next) => {
  console.error('🔥 Lỗi:', err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Lỗi server' : err.message;
  
  res.status(statusCode).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 8. Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await initializeDatabase();
  console.log(`🚀 Server đang chạy trên port ${PORT}`);
  console.log(`🔗 Truy cập: http://localhost:${PORT}`);
});

// 9. Xử lý tắt server
process.on('SIGTERM', () => {
  console.log('🛑 Tắt server...');
  server.close(() => {
    console.log('✅ Server đã tắt');
    process.exit(0);
  });
});