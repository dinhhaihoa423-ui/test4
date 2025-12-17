// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const { Contact } = require('../models'); // sequelize models

// GET: Lấy thông tin liên lạc (chỉ có 1 bản ghi)
router.get('/', async (req, res) => {
  try {
    let contact = await Contact.findOne();
    if (!contact) {
      // Nếu chưa có, tạo bản ghi mặc định
      contact = await Contact.create({
        email: 'event@gmail.com',
        phone: '0123 456 789',
        address: 'PTIT TP.HCM'
      });
    }
    res.json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: Cập nhật thông tin liên lạc
router.put('/', async (req, res) => {
  try {
    const { email, phone, address } = req.body;
    let contact = await Contact.findOne();
    if (!contact) {
      contact = await Contact.create({ email, phone, address });
    } else {
      await contact.update({ email, phone, address });
    }
    res.json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
