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
      imageUrl: 'https://scontent.fsgn5-14.fna.fbcdn.net/v/t39.30808-6/596291951_1518183076129404_2296339519766816378_n.jpg?_nc_cat=106&_nc_cb=99be929b-ad57045b&ccb=1-7&_nc_sid=127cfc&_nc_ohc=fKa7AWfoI1cQ7kNvwH-sP5V&_nc_oc=Admt3iZ-Su7W3uaLMCAwzvBW080OPWdABEQPnU_1ZOez6sZg2vv9nuf8ijVpFB-lSyyi-nhJFsO_-6IMrqCEFXkh&_nc_zt=23&_nc_ht=scontent.fsgn5-14.fna&_nc_gid=VF33NjwDD_FQQKS3okjukA&oh=00_AfmsqsvwAtNNlpvAt_0wdxROxB2Sel6kVl72QAbREhxb2Q&oe=693F035D', // ảnh thật, đẹp
      status: 'pending'
    },
    {
      title: 'RECAP HCMPTIT ICPC 2025',
      author: 'Chu Văn Phong',
      timestamp: '21:34:54 9/12/2025',
      imageUrl: 'https://i.imgur.com/Qw1Z9kM.jpeg',
      status: 'pending'
    },
    {
      title: 'RECAP ASTEES COLLECTION REVEAL 2025',
      author: 'Vương Sơn Hà',
      timestamp: '22:30:00 17/12/2025',
      imageUrl: 'https://i.imgur.com/XkL5vP2s.jpeg',
      status: 'pending'
    },
    {
      title: 'RECAP CASTING THE ASTRO - THE INFINITY GEN',
      author: 'Dương Minh Thoại',
      timestamp: '20:34:54 5/12/2025',
      imageUrl: 'https://i.imgur.com/7pX9m3D.jpeg',
      status: 'approved'
    },
    {
      title: 'RECAP - HCM PTIT MULTIMEDIA 2025',
      author: 'Lê Nhất Duy',
      timestamp: '23:34:54 7/12/2025',
      imageUrl: 'https://i.imgur.com/Zf8vR9k.jpeg',
      status: 'approved'
    }
  ]);
  console.log('ĐÃ RESEED 5 BÀI UGC VỚI ẢNH ONLINE – ẢNH SẼ HIỆN NGAY!');
}

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

