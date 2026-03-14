const mongoose = require('mongoose');

const productTestSchema = new mongoose.Schema({
  productName: { type: String, required: true, trim: true },
  productType: {
    type: String,
    enum: ['tablet', 'juice', 'powder', 'other'],
    required: true
  },
  measuredConcentration: { type: Number, required: true }, // mg/ml
  nominalConcentration: { type: Number, required: true },  // mg/ml
  delta: { type: Number },  // auto-calculated
  sensorUsed: { type: String, default: 'Type IV' },
  batchNumber: { type: String },
  testDate: { type: Date, default: Date.now },
  notes: { type: String },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

// Auto-calculate delta before save
productTestSchema.pre('save', function (next) {
  this.delta = Math.abs(this.measuredConcentration - this.nominalConcentration);
  next();
});

module.exports = mongoose.model('ProductTest', productTestSchema);
