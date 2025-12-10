const express = require('express');
const router = express.Router();
const Ugc = require('../models/Ugc');

// GET pending contents
router.get('/pending', async (req, res) => {
  try {
    const contents = await Ugc.findAll({ where: { status: 'pending' } });
    res.json(contents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET approved contents
router.get('/approved', async (req, res) => {
  try {
    const contents = await Ugc.findAll({ where: { status: 'approved' } });
    res.json(contents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST approve
router.post('/approve/:id', async (req, res) => {
  try {
    const content = await Ugc.findByPk(req.params.id);
    if (!content) return res.status(404).json({ error: 'Not found' });
    content.status = 'approved';
    await content.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST reject (chuyển sang rejected, nhưng không xóa)
router.post('/reject/:id', async (req, res) => {
  try {
    const content = await Ugc.findByPk(req.params.id);
    if (!content) return res.status(404).json({ error: 'Not found' });
    content.status = 'rejected';
    await content.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST delete (chuyển sang archived hoặc xóa thật, ở đây tôi dùng archived để giữ lịch sử)
router.post('/delete/:id', async (req, res) => {
  try {
    const content = await Ugc.findByPk(req.params.id);
    if (!content) return res.status(404).json({ error: 'Not found' });
    content.status = 'archived';
    await content.save();
    // Hoặc xóa thật: await content.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
