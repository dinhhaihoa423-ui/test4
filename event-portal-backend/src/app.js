require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');

// Models
const Organization = require('./models/Organization');
const Event = require('./models/Event');
const Ugc = require('./models/Ugc'); // Thêm model UGC

// Routes
const organizationRoutes = require('./routes/organizationRoutes');
const eventRoutes = require('./routes/eventRoutes');
const ugcRoutes = require('./routes/ugcRoutes'); // Thêm route UGC

const app = express();

// CORS - Cho phép frontend (GitHub Pages, localhost, mọi nơi) gọi API
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  next();
});

app.use(express.json());

// Phục vụ file tĩnh
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/picture', express.static(path.join(__dirname, '../picture'))); // Thêm để phục vụ ảnh UGC

// Routes
app.use('/api/organizations', organizationRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/ugc', ugcRoutes); // Route mới cho UGC

// Test server
app.get('/', (req, res) => {
  res.send('<h1>Backend Event Portal + UGC đang chạy ngon lành!</h1>');
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Kết nối PostgreSQL thành công');

    await sequelize.sync({ alter: true }); // Tạo/sửa bảng tự động
    console.log('Đồng bộ các bảng xong');

    // Seed dữ liệu mẫu UGC nếu chưa có
    const ugcCount = await Ugc.count();
    if (ugcCount === 0) {
      await Ugc.bulkCreate([
        {
          title: 'RECAP CSV 2025',
          author: 'Nguyễn Văn Dương',
          timestamp: '20:00:00 16/12/2025',
          imageUrl: '/picture/recapcsv.jpg',
          status: 'pending'
        },
        {
          title: 'RECAP HCMPTIT ICPC 2025',
          author: 'Chu Văn Phong',
          timestamp: '21:34:54 9/12/2025',
          imageUrl: '/picture/recapitmc.jpg',
          status: 'pending'
        },
        {
          title: 'RECAP ASTEES COLLECTION REVEAL 2025',
          author: 'Vương Sơn Hà',
          timestamp: '22:30:00 17/12/2025',
          imageUrl: '/picture/recapazone.jpg',
          status: 'pending'
        },
        {
          title: 'RECAP CASTING THE ASTRO - THE INFINITY GEN',
          author: 'Dương Minh Thoại',
          timestamp: '20:34:54 5/12/2025',
          imageUrl: '/picture/recapcmc.jpg',
          status: 'approved'
        },
        {
          title: 'RECAP - HCM PTIT MULTIMEDIA 2025',
          author: 'Lê Nhất Duy',
          timestamp: '23:34:54 7/12/2025',
          imageUrl: '/picture/recaplcd.jpg',
          status: 'approved'
        }
      ]);
      console.log('Đã seed 5 bài UGC mẫu');
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server chạy tại: https://test4-7cop.onrender.com`);
      console.log(`API UGC: https://test4-7cop.onrender.com/api/ugc/pending`);
    });
  } catch (error) {
    console.error('Lỗi khởi động server:', error);
  }
}

startServer();
