// src/routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/eventController');

router.get('/', ctrl.getAll);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.delete);
router.patch('/:id/status', ctrl.changeStatus);

module.exports = router;