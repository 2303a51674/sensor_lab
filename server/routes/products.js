const express = require('express');
const router = express.Router();
const ProductTest = require('../models/ProductTest');
const { protect } = require('../middleware/auth');

// GET /api/products
router.get('/', protect, async (req, res) => {
  try {
    const products = await ProductTest.find().populate('recordedBy', 'name').sort('-testDate');
    res.json(products);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/products
router.post('/', protect, async (req, res) => {
  try {
    const product = await ProductTest.create({ ...req.body, recordedBy: req.user._id });
    res.status(201).json(product);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// DELETE /api/products/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    await ProductTest.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product test deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/products/seed
router.post('/seed', protect, async (req, res) => {
  try {
    await ProductTest.deleteMany({});
    const seeds = [
      { productName: 'Tongchen Effervescent Tablets', productType: 'tablet', measuredConcentration: 22.04, nominalConcentration: 22.5 },
      { productName: 'Kangenbei Chewable Tablets', productType: 'tablet', measuredConcentration: 20.37, nominalConcentration: 21.3 },
      { productName: 'Vitamin C Tablets', productType: 'tablet', measuredConcentration: 10.79, nominalConcentration: 10 },
      { productName: 'Prickly Pear Juice', productType: 'juice', measuredConcentration: 15.54, nominalConcentration: 15 },
      { productName: 'Sea Buckthorn Juice', productType: 'juice', measuredConcentration: 6.34, nominalConcentration: 6.15 },
    ];
    const created = await ProductTest.insertMany(seeds.map(s => ({ ...s, recordedBy: req.user._id })));
    res.status(201).json({ message: `Seeded ${created.length} product tests`, data: created });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
