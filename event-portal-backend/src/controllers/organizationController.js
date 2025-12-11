const Organization = require('../models/Organization');   
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cấu hình storage tự động upload lên Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'event-portal/organizations', // thư mục trên Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    public_id: (req, file) => 'org-' + Date.now() + '-' + Math.floor(Math.random() * 10000),
  },
});

const upload = require('multer')({ storage });

// GET all
exports.getAll = async (req, res) => {
  try {
    const orgs = await Organization.findAll({ order: [['createdAt', 'DESC']] });
    res.json(orgs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE
exports.create = [
  upload.single('avatar'),
  async (req, res) => {
    try {
      const { name, description, email, fanpage } = req.body;
      let avatar = req.file
        ? req.file.path // Cloudinary tự trả về URL
        : `https://via.placeholder.com/70x70/007bff/ffffff?text=${encodeURIComponent(name)}`;

      const org = await Organization.create({ name, description, email, fanpage, avatar });
      res.status(201).json(org);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
];

// UPDATE
exports.update = [
  upload.single('avatar'),
  async (req, res) => {
    try {
      const org = await Organization.findByPk(req.params.id);
      if (!org) return res.status(404).json({ error: 'Không tìm thấy' });

      const { name, description, email, fanpage } = req.body;
      const avatar = req.file ? req.file.path : org.avatar;

      await org.update({ name, description, email, fanpage, avatar });
      const updated = await Organization.findByPk(req.params.id);
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
];

// DELETE
exports.delete = async (req, res) => {
  try {
    const org = await Organization.findByPk(req.params.id);
    if (!org) return res.status(404).json({ error: 'Không tìm thấy' });

    // Xóa ảnh trên Cloudinary nếu cần (tùy chọn)
    if (org.avatar && org.avatar.includes('res.cloudinary.com')) {
      const publicId = org.avatar.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`event-portal/organizations/${publicId}`);
    }

    await org.destroy();
    res.json({ message: 'Xóa thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
