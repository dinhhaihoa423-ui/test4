// app.js - HOÀN CHỈNH, ĐÃ THÊM SOCIAL MEDIA, CHẠY NGON TRÊN RENDER
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');

// ==================== MODELS ====================
const Organization = require('./models/Organization');
const Event = require('./models/Event');
const Ugc = require('./models/Ugc');
const SocialMedia = require('./models/SocialMedia'); // ← ĐÃ THÊM

// ==================== ROUTES ====================
const organizationRoutes = require('./routes/organizationRoutes');
const eventRoutes = require('./routes/eventRoutes');
const ugcRoutes = require('./routes/ugcRoutes');
const socialMediaRoutes = require('./routes/socialMediaRoutes'); // ← ĐÃ THÊM

const app = express();

// ==================== CẤU HÌNH ====================
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve file tĩnh
app.use('/picture', express.static(path.join(__dirname, 'picture')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==================== ĐĂNG KÝ ROUTES ====================
app.use('/api/organizations', organizationRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/ugc', ugcRoutes);
app.use('/api/social-medias', socialMediaRoutes); // ← ROUTE MỚI

// ==================== TRANG TEST ====================
app.get('/', (req, res) => {
  res.send(`
    <h1 style="font-family: Arial; text-align: center; margin-top: 50px;">
      Backend Event Portal ĐANG CHẠY MƯỢT MÀ!
    </h1>
    <p style="text-align: center; font-size: 18px;">
      <img src="https://i.postimg.cc/h4QN9B0V/recapcsv.jpg" width="400"><br><br>
      <a href="/api/ugc/pending">→ Xem UGC chờ duyệt</a> | 
      <a href="/api/ugc/approved">→ Xem UGC đã duyệt</a><br><br>
      <a href="/api/social-medias">→ Xem danh sách mạng xã hội (DB thật)</a>
    </p>
  `);
});

const PORT = process.env.PORT || 5000;

// ==================== KHỞI ĐỘNG SERVER ====================
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Kết nối PostgreSQL thành công!');

    // Đồng bộ tất cả bảng (an toàn cho Render)
    await sequelize.sync({ force: false });
    console.log('Đồng bộ bảng thành công!');

    // === SEED UGC (chỉ chạy 1 lần) ===
    const ugcCount = await Ugc.count();
    if (ugcCount === 0) {
      console.log('Đang seed 5 bài UGC mẫu...');
      await Ugc.bulkCreate([
        { title: 'RECAP CSV 2025', author: 'Nguyễn Văn Dương', timestamp: '20:00:00 16/12/2025', imageUrl: 'https://i.postimg.cc/h4QN9B0V/recapcsv.jpg', status: 'pending' },
        { title: 'RECAP HCMPTIT ICPC 2025', author: 'Chu Văn Phong', timestamp: '21:34:54 9/12/2025', imageUrl: 'https://i.postimg.cc/pXkXwG24/recapitmc.jpg', status: 'pending' },
        { title: 'RECAP ASTEES COLLECTION REVEAL 2025', author: 'Vương Sơn Hà', timestamp: '22:30:00 17/12/2025', imageUrl: 'https://i.postimg.cc/526JjN3B/recapazone.jpg', status: 'pending' },
        { title: 'RECAP CASTING THE ASTRO', author: 'Dương Minh Thoại', timestamp: '20:34:54 5/12/2025', imageUrl: 'https://i.postimg.cc/Xv15nNny/recapcmc.jpg', status: 'approved' },
        { title: 'RECAP HCM PTIT MULTIMEDIA 2025', author: 'Lê Nhất Duy', timestamp: '23:34:54 7/12/2025', imageUrl: 'https://i.postimg.cc/K8RFdmpt/recaplcd.jpg', status: 'approved' }
      ]);
      console.log('Seed UGC thành công!');
    }

    // === SEED SOCIAL MEDIA (nếu chưa có) ===
    const smCount = await SocialMedia.count();
    if (smCount === 0) {
      console.log('Đang seed mạng xã hội mẫu...');
      await SocialMedia.bulkCreate([
        { name: 'Facebook', link: 'https://www.facebook.com/eventportal' },
        { name: 'Zalo', link: 'https://zalo.me/eventportal' },
        { name: 'Instagram', link: 'https://instagram.com/eventportal' }
      ]);
      console.log('Seed mạng xã hội thành công!');
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server chạy tại: https://test4-7cop.onrender.com`);
      console.log(`API UGC: https://test4-7cop.onrender.com/api/ugc/pending`);
      console.log(`API MXH: https://test4-7cop.onrender.com/api/social-medias`);
    });

  } catch (error) {
    console.error('Lỗi khởi động server:', error.message);

    // Vẫn cho server chạy để debug
    app.use((req, res) => {
      res.status(500).json({
        error: 'Server lỗi khởi động',
        message: error.message
      });
    });

    app.listen(PORT, '0.0.0.0', () => {
      console.log('Server chạy ở chế độ lỗi');
    });
  }
}

startServer();
