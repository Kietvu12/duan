require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const sequelize = require('./config/db');
const authRoutes = require('./routes/auth.route');
const groupRoutes = require('./routes/group.route')

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(helmet());
app.use(bodyParser.json({ limit: '10kb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100 
});
app.use('/api/', limiter);

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ Kết nối database thành công');
    
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync();
      console.log('🔄 Database đã đồng bộ (alter)');
    }
  } catch (error) {
    console.error('❌ Lỗi database:', error);
    process.exit(1); 
  }
}

app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await initializeDatabase();
  console.log(`🚀 Server đang chạy trên port ${PORT}`);
  console.log(`🔗 Truy cập: http://localhost:${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('🛑 Tắt server...');
  server.close(() => {
    console.log('✅ Server đã tắt');
    process.exit(0);
  });
});