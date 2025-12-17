// src/routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');
const Contact = require('../models/Contact');

// GET: Lấy thông tin liên lạc (chỉ 1 bản ghi duy nhất)
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
    console.error(err);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// PUT: Cập nhật thông tin liên lạc
router.put('/', async (req, res) => {
  try {
    const { email, phone, address } = req.body;

    if (!email || !phone || !address) {
      return res.status(400).json({ error: 'Thiếu dữ liệu' });
    }

    let contact = await Contact.findOne();
    if (!contact) {
      contact = await Contact.create({ email, phone, address });
    } else {
      await contact.update({ email, phone, address });
    }

    res.json(contact);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

module.exports = router;
