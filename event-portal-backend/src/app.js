require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');

// Models
const Organization = require('./models/Organization');
const Event = require('./models/Event');
const Ugc = require('./models/Ugc');

// Routes
const organizationRoutes = require('./routes/organizationRoutes');
const eventRoutes = require('./routes/eventRoutes');
const ugcRoutes = require('./routes/ugcRoutes');

const app = express();

// Cấu hình
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Phục vụ file tĩnh - FIX: Serve /picture từ THƯ MỤC BACKEND (không dùng ../)
app.use('/picture', express.static(path.join(__dirname, 'picture'))); // ← DÒNG QUAN TRỌNG: picture trong backend
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Backup nếu có

// Routes
app.use('/api/organizations', organizationRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/ugc', ugcRoutes);

// Test page với ảnh
app.get('/', (req, res) => {
  res.send(`
    <h1>Backend Event Portal + UGC OK!</h1>
    <p>Test ảnh từ /picture (backend): <img src="/picture/recapcsv.jpg" alt="Test" width="200"></p>
    <p>API UGC: <a href="/api/ugc/pending">/api/ugc/pending</a></p>
  `);
});

const PORT = process.env.PORT || 5000;

// Start server + FORCE RESEED với /picture từ backend
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Kết nối PostgreSQL OK');

    await sequelize.sync({ alter: true });
    console.log('✅ Đồng bộ bảng OK');

    // FORCE RESEED UGC - Xóa cũ và tạo mới với /picture từ backend
    console.log('🔄 Force reseed UGC với ảnh từ /picture (backend)...');
    await Ugc.destroy({ where: {} }); // Xóa hết cũ (xóa dòng này sau test OK)
    await Ugc.bulkCreate([
      {
        title: 'RECAP CSV 2025',
        author: 'Nguyễn Văn Dương',
        timestamp: '20:00:00 16/12/2025',
        imageUrl: '/picture/recapcsv.jpg',  // ← ĐÚNG: /picture trong backend
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
    console.log('✅ Reseed 5 UGC với /picture OK');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server: https://test4-7cop.onrender.com`);
      console.log(`📸 Test ảnh: https://test4-7cop.onrender.com/picture/recapcsv.jpg`);
    });

  } catch (error) {
    console.error('❌ Lỗi server:', error);
    process.exit(1);
  }
}

startServer();
