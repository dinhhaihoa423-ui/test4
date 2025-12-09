require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');

const organizationRoutes = require('./routes/organizationRoutes');
const eventRoutes = require('./routes/eventRoutes');

const app = express();

// ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←
// SỬA CHỖ NÀY: Cho phép tất cả frontend gọi API
app.use(cors({
  origin: '*'   // Quan trọng nhất – không có dòng này = frontend bị chặn
}));
// ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/organizations', organizationRoutes);
app.use('/api/events', eventRoutes);

app.get('/', (req, res) => {
  res.send('<h1>Event Portal Backend Đang Chạy OK!</h1>');
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Kết nối DB thành công');
    await sequelize.sync({ alter: true });
    console.log('DB đã sync');

    app.listen(PORT, () => {
      console.log(`Server chạy tại: https://test4-7cop.onrender.com`);
    });
  } catch (err) {
    console.error('Lỗi server:', err);
  }
}

startServer();
