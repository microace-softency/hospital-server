const express = require('express');
const router = express.Router();
const db = require('../db');

// Get registrations today
router.get('/registrations/today', async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  try {
    const results = await db.query(
      "SELECT COUNT(*) AS count FROM registation WHERE DATE(date) = DATE(NOW())"
    );
    res.json({ count: results[0].count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching registrations count', error });
  }
});

// Get admissions today
router.get('/admissions/today', async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  try {
    const results = await db.query(
      "SELECT COUNT(*) AS count FROM admissions WHERE DATE(date) = DATE(NOW())"
    );
    res.json({ count: results[0].count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admissions count', error });
  }
});

// Get collections today
router.get('/collections/today', async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  try {
    const results = await db.query(
      "SELECT SUM(amount) AS total FROM collections WHERE DATE(date) = DATE(NOW())"
    );
    res.json({ total: results[0].total || 0 });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching collections total', error });
  }
});

// Get free patients today
router.get('/freepatients/today', async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  try {
    const results = await db.query(
      "SELECT COUNT(*) AS count FROM freepatients WHERE DATE(date) = DATE(NOW())"
    );
    res.json({ count: results[0].count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching free patients count', error });
  }
});

module.exports = router;
