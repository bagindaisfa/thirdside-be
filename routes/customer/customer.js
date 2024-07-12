// customer_api.js
const express = require('express');
const router = express.Router();
const db = require('../../db');

// GET customer
router.get('/customer', (req, res) => {
  db.query('SELECT * FROM master_customer', (err, results) => {
    if (err) {
      console.error('Error fetching master_customer:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ customer: results });
  });
});

// POST customer
router.post('/customer', async (req, res) => {
  const { name, phone_no } = req.query;
  const sqlQuery = `INSERT INTO master_customer (name,phone_no) VALUES (?,?)`;
  db.query(sqlQuery, [name, phone_no], (err, results) => {
    if (err) {
      console.error('Error insert master_customer:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ customer: results });
  });
});

// PUT customer
router.put('/customer', async (req, res) => {
  const { id, name, phone_no } = req.query;
  const sqlQuery = `UPDATE master_customer SET name=?, phone_no=? WHERE id=?`;
  db.query(sqlQuery, [name, phone_no, id], (err, results) => {
    if (err) {
      console.error('Error update master_customer:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ customer: results });
  });
});

// DELETE customer
router.delete('/customer', async (req, res) => {
  const { id } = req.query;
  const sqlQuery = `DELETE FROM master_customer WHERE id=?`;
  db.query(sqlQuery, [id], (err, results) => {
    if (err) {
      console.error('Error delete master_customer:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ customer: results });
  });
});

module.exports = router;
