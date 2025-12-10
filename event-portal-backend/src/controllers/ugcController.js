const Ugc = require('../models/Ugc');

exports.getByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const ugcs = await Ugc.findAll({ where: { status } });
    res.json(ugcs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const ugc = await Ugc.findByPk(id);
    if (!ugc) return res.status(404).json({ error: 'UGC not found' });
    ugc.status = status;
    await ugc.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
