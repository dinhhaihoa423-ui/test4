require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const sequelize = require('./config/database');

// Import models để Sequelize biết có bảng nào
require('./models/Organization');
require('./models/Event');   // ← thêm dòng này

const organizationRoutes = require('./routes/organizationRoutes');
const eventRoutes = require('./routes/eventRoutes');

const app = express();

// TỰ ĐỘNG TẠO THƯ MỤC UPLOADS (nếu dùng local)
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/organizations', organizationRoutes);
app.use('/api/events', eventRoutes);   // ← thêm dòng này

app.get('/', (req, res) => {
  res.send('Event Portal Backend đang chạy ngon lành!');
});

// KHỞI ĐỘNG SERVER + TỰ ĐỘNG TẠO BẢNG (không cần migrate)
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Kết nối database thành công');

    // TỰ ĐỘNG TẠO BẢNG NẾU CHƯA CÓ (thay thế hoàn toàn migrate)
    await sequelize.sync({ alter: true });  // alter: true = tự động sửa bảng nếu cần
    console.log('Tất cả bảng đã được tạo/tự động cập nhật thành công!');

    app.listen(PORT, () => {
      console.log(`Server chạy tại: https://test4-7cop.onrender.com`);
    });
  } catch (error) {
    console.error('Lỗi:', error);
  }
}

startServer();
