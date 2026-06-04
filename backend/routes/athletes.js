const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Athlete = require('../models/Athlete');

// GET /api/athletes
router.get('/', auth, (req, res) => {
  try {
    const { search, sport, page = 1, limit = 10 } = req.query;
    const query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (sport) query.sport = sport;

    const total = Athlete.countDocuments(query);
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const athletes = Athlete.findPage(query, {
      sort: 'createdAt',
      skip: (pageNum - 1) * limitNum,
      limit: limitNum,
    });

    res.json({ athletes, total, page: pageNum, totalPages: Math.ceil(total / limitNum) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/athletes
router.post('/', auth, (req, res) => {
  try {
    const athlete = Athlete.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json(athlete);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/athletes/:id
router.put('/:id', auth, (req, res) => {
  try {
    const athlete = Athlete.findByIdAndUpdate(req.params.id, req.body);
    if (!athlete) return res.status(404).json({ message: 'Athlete not found' });
    res.json(athlete);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/athletes/:id
router.delete('/:id', auth, (req, res) => {
  try {
    Athlete.findByIdAndDelete(req.params.id);
    res.json({ message: 'Athlete deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
