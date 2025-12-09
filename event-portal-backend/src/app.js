require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');

const organizationRoutes = require('./routes/organizationRoutes');
const eventRoutes = require('./routes/eventRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Phục vụ ảnh tĩnh (nếu còn dùng local uploads, giữ lại cũng được)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/organizations', organizationRoutes);
app.use('/api/events', eventRoutes);

// Trang chủ test server
app.get('/', (req, res) => {
  res.send('<h1>Event Portal Backend đang chạy ngon!</h1><p>API: /api/organizations | /api/events</p>');
});

// Khởi động server + sync DB
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Kết nối PostgreSQL thành công');

    // ĐÚNG VỊ TRÍ: sync ở trong hàm async
    await sequelize.sync({ alter: true }); // alter: true để tự động tạo bảng Event
    console.log('Database đã được đồng bộ (có bảng Event)');

    app.listen(PORT, () => {
      console.log(`Server đang chạy tại: https://test4-7cop.onrender.com`);
      console.log(`Port: ${PORT}`);
    });
  } catch (error) {
    console.error('Lỗi khởi động server:', error);
    process.exit(1);
  }
}

startServer();
