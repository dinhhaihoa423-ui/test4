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

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/picture', express.static(path.join(__dirname, 'picture')));

// Routes
app.use('/api/organizations', organizationRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/ugc', ugcRoutes);

app.get('/', (req, res) => {
  res.send('<h1>Backend OK!</h1>');
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('DB OK');

    // SỬA DÒNG NÀY – CHỐNG CRASH KHI CÓ CỘT NOT NULL
    await sequelize.sync({ alter: false }); // hoặc { alter: true, match: /_test4$/ }

    console.log('Sync OK');

    // Seed UGC (giữ nguyên)
    const ugcCount = await Ugc.count();
    if (ugcCount === 0 || true) {
      console.log('Reseed UGC với ảnh online...');
      await Ugc.destroy({ where: {} });
      await Ugc.bulkCreate([
        { title: 'RECAP CSV 2025', author: 'Nguyễn Văn Dương', timestamp: '20:00 16/12/2025', imageUrl: 'https://i.imgur.com/8JZ1k8P.jpeg', status: 'pending' },
        { title: 'RECAP HCMPTIT ICPC 2025', author: 'Chu Văn Phong', timestamp: '21:34 9/12/2025', imageUrl: 'https://i.imgur.com/Qw1Z9kM.jpeg', status: 'pending' },
        { title: 'RECAP ASTEES 2025', author: 'Vương Sơn Hà', timestamp: '22:30 17/12/2025', imageUrl: 'https://i.imgur.com/XkL5vP2s.jpeg', status: 'pending' },
        { title: 'CASTING THE ASTRO', author: 'Dương Minh Thoại', timestamp: '20:34 5/12/2025', imageUrl: 'https://i.imgur.com/7pX9m3D.jpeg', status: 'approved' },
        { title: 'HCM PTIT MULTIMEDIA 2025', author: 'Lê Nhất Duy', timestamp: '23:34 7/12/2025', imageUrl: 'https://i.imgur.com/Zf8vR9k.jpeg', status: 'approved' }
      ]);
      console.log('ĐÃ RESEED UGC');
    }

    app.listen(PORT, '0.0.0.0', () => console.log('Server OK'));
  } catch (err) {
    console.error('Lỗi:', err);
  }
}

startServer();
