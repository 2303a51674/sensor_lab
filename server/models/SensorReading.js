const mongoose = require('mongoose');

const sensorReadingSchema = new mongoose.Schema({
  sensorType: {
    type: String,
    enum: ['Type I', 'Type II', 'Type III', 'Type IV'],
    required: true
  },
  waistDiameter: { type: Number }, // in µm
  waistLength: { type: Number },   // in mm
  hasBend: { type: Boolean, default: false },
  sensitivity: { type: Number, required: true },   // a.u./(mg·ml⁻¹)
  lod: { type: Number, required: true },           // mg/ml
  concentration: { type: Number },                 // mg/ml tested
  absorbance: { type: Number },                    // a.u.
  absorptionPeak1: { type: Number, default: 1760 }, // cm⁻¹
  absorptionPeak2: { type: Number, default: 1690 }, // cm⁻¹
  notes: { type: String },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SensorReading', sensorReadingSchema);
