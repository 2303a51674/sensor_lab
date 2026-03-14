const express = require('express');
const router = express.Router();
const SensorReading = require('../models/SensorReading');
const { protect } = require('../middleware/auth');

// GET /api/sensors — get all readings
router.get('/', protect, async (req, res) => {
  try {
    const readings = await SensorReading.find().populate('recordedBy', 'name').sort('-createdAt');
    res.json(readings);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/sensors/stats — summary stats
router.get('/stats', protect, async (req, res) => {
  try {
    const total = await SensorReading.countDocuments();
    const best = await SensorReading.findOne({ sensorType: 'Type IV' }).sort('-sensitivity');
    const avgSensitivity = await SensorReading.aggregate([
      { $group: { _id: null, avg: { $avg: '$sensitivity' } } }
    ]);
    res.json({
      total,
      bestSensitivity: best?.sensitivity || 0.1257,
      bestLoD: best?.lod || 0.917,
      avgSensitivity: avgSensitivity[0]?.avg || 0
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/sensors — add reading
router.post('/', protect, async (req, res) => {
  try {
    const reading = await SensorReading.create({ ...req.body, recordedBy: req.user._id });
    res.status(201).json(reading);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// DELETE /api/sensors/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    await SensorReading.findByIdAndDelete(req.params.id);
    res.json({ message: 'Reading deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/sensors/seed — seed default research data
router.post('/seed', protect, async (req, res) => {
  try {
    await SensorReading.deleteMany({});
    const seeds = [
      { sensorType: 'Type I', waistDiameter: 75, waistLength: 10, hasBend: false, sensitivity: 0.0708, lod: 2.895, concentration: 90, absorbance: 0.12 },
      { sensorType: 'Type II', waistDiameter: 75, waistLength: 30, hasBend: false, sensitivity: 0.0978, lod: 1.783, concentration: 90, absorbance: 0.17 },
      { sensorType: 'Type III', waistDiameter: 50, waistLength: 30, hasBend: false, sensitivity: 0.1101, lod: 1.540, concentration: 90, absorbance: 0.20 },
      { sensorType: 'Type IV', waistDiameter: 50, waistLength: 30, hasBend: true, sensitivity: 0.1257, lod: 0.917, concentration: 90, absorbance: 0.23 },
    ];
    const created = await SensorReading.insertMany(seeds.map(s => ({ ...s, recordedBy: req.user._id })));
    res.status(201).json({ message: `Seeded ${created.length} sensor readings`, data: created });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
