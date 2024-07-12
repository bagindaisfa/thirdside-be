// payment_method_api.js
const express = require('express');
const router = express.Router();
const db = require('../../db');

// GET payment_method
router.get('/payment_method', (req, res) => {
  db.query('SELECT * FROM master_payment_method', (err, results) => {
    if (err) {
      console.error('Error fetching master_payment_method:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ payment_method: results });
  });
});

// POST payment_method
router.post('/payment_method', async (req, res) => {
  const { name, remark } = req.query;
  const sqlQuery = `INSERT INTO master_payment_method (name,remark) VALUES (?,?)`;
  db.query(sqlQuery, [name, remark], (err, results) => {
    if (err) {
      console.error('Error insert master_payment_method:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ payment_method: results });
  });
});

// PUT payment_method
router.put('/payment_method', async (req, res) => {
  const { id, name, remark } = req.query;
  const sqlQuery = `UPDATE master_payment_method SET name=?, remark=? WHERE id=?`;
  db.query(sqlQuery, [name, remark, id], (err, results) => {
    if (err) {
      console.error('Error update master_payment_method:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ payment_method: results });
  });
});

// DELETE payment_method
router.delete('/payment_method', async (req, res) => {
  const { id } = req.query;
  const sqlQuery = `DELETE FROM master_payment_method WHERE id=?`;
  db.query(sqlQuery, [id], (err, results) => {
    if (err) {
      console.error('Error delete master_payment_method:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ payment_method: results });
  });
});

module.exports = router;
