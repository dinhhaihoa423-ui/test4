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
app.use('/picture', express.static(path.join(__dirname, 'picture'))); // ← QUAN TRỌNG: picture trong backend
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Backup

// Routes
app.use('/api/organizations', organizationRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/ugc', ugcRoutes);

// Test page với ảnh (để check serve)
app.get('/', (req, res) => {
  res.send(`
    <h1>Backend Event Portal + UGC OK!</h1>
    <p>Test ảnh từ /picture (backend): <img src="/picture/recapcsv.jpg" alt="Test" width="200" onerror="this.src='https://via.placeholder.com/200?text=No+Image'"></p>
    <p><a href="/api/ugc/pending">Test API UGC</a></p>
  `);
});

const PORT = process.env.PORT || 5000;

// Start server + FORCE RESEED đầy đủ 5 bài
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Kết nối PostgreSQL OK');

    await sequelize.sync({ alter: true });
    console.log('✅ Đồng bộ bảng OK');

    // === SEED UGC MẪU – DÙNG LINK ẢNH ONLINE (KHÔNG CẦN THƯ MỤC ẢNH NỮA) ===
const ugcCount = await Ugc.count();
if (ugcCount === 0 || true) { // || true để force reseed 1 lần
  console.log('Reseed UGC với ảnh online...');
  await Ugc.destroy({ where: {} }); // Xóa data cũ

  await Ugc.bulkCreate([
    {
      title: 'RECAP CSV 2025',
      author: 'Nguyễn Văn Dương',
      timestamp: '20:00:00 16/12/2025',
      imageUrl: 'https://i.postimg.cc/h4QN9B0V/recapcsv.jpg', // ảnh thật, đẹp
      status: 'pending'
    },
    {
      title: 'RECAP HCMPTIT ICPC 2025',
      author: 'Chu Văn Phong',
      timestamp: '21:34:54 9/12/2025',
      imageUrl: 'https://i.postimg.cc/pXkXwG24/recapitmc.jpg',
      status: 'pending'
    },
    {
      title: 'RECAP ASTEES COLLECTION REVEAL 2025',
      author: 'Vương Sơn Hà',
      timestamp: '22:30:00 17/12/2025',
      imageUrl: 'https://i.postimg.cc/526JjN3B/recapazone.jpg',
      status: 'pending'
    },
    {
      title: 'RECAP CASTING THE ASTRO - THE INFINITY GEN',
      author: 'Dương Minh Thoại',
      timestamp: '20:34:54 5/12/2025',
      imageUrl: 'https://i.postimg.cc/Xv15nNny/recapcmc.jpg',
      status: 'approved'
    },
    {
      title: 'RECAP - HCM PTIT MULTIMEDIA 2025',
      author: 'Lê Nhất Duy',
      timestamp: '23:34:54 7/12/2025',
      imageUrl: 'https://i.postimg.cc/K8RFdmpt/recaplcd.jpg',
      status: 'approved'
    }
  ]);
  console.log('ĐÃ RESEED 5 BÀI UGC VỚI ẢNH ONLINE – ẢNH SẼ HIỆN NGAY!');
}

// ... code cũ ...

// Seed UGC (giữ nguyên nếu có)

// THÊM SEED SAMPLE CHO EVENTS (pending 3, approved 2)
const eventCount = await Event.count();
if (eventCount === 0) {
  await Event.bulkCreate([
    {
      title: 'Sự kiện CSV 2025',
      description: 'Mô tả sự kiện CSV chi tiết...',
      date: '2025-12-16',
      location: 'Hà Nội',
      imageUrl: 'https://i.imgur.com/8JZ1k8P.jpeg', // link online ngắn
      status: 'pending'
    },
    {
      title: 'ICPC HCMPTIT 2025',
      description: 'Mô tả ICPC...',
      date: '2025-12-09',
      location: 'TP.HCM',
      imageUrl: 'https://i.imgur.com/Qw1Z9kM.jpeg',
      status: 'pending'
    },
    {
      title: 'ASTEES COLLECTION REVEAL 2025',
      description: 'Mô tả ASTEES...',
      date: '2025-12-17',
      location: 'Hà Nội',
      imageUrl: 'https://i.imgur.com/XkL5vP2s.jpeg',
      status: 'pending'
    },
    {
      title: 'CASTING THE ASTRO - THE INFINITY GEN',
      description: 'Mô tả Casting Astro...',
      date: '2025-12-05',
      location: 'TP.HCM',
      imageUrl: 'https://i.imgur.com/7pX9m3D.jpeg',
      status: 'approved'
    },
    {
      title: 'HCM PTIT MULTIMEDIA 2025',
      description: 'Mô tả Multimedia...',
      date: '2025-12-07',
      location: 'TP.HCM',
      imageUrl: 'https://i.imgur.com/Zf8vR9k.jpeg',
      status: 'approved'
    }
  ]);
  console.log('Đã seed 5 sự kiện mẫu (3 pending, 2 approved)');
}

// ... app.listen ...
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




