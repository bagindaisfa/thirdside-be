// product_api.js
const express = require('express');
const router = express.Router();
const db = require('../../db');

// GET product
router.get('/product', (req, res) => {
  db.query(
    `
        SELECT 
            A.id,
            A.name,
            A.price,
            COALESCE(C.price_per_unit, 0) * COALESCE(B.qty, 0) AS hpp,
            B.qty AS material_qty,
            C.name AS material_name,
            C.price_per_unit AS material_price
        FROM master_product A
        LEFT JOIN product_detail B ON A.id = B.product_id
        LEFT JOIN master_raw_material C ON B.raw_material_id = C.id;
      `,
    (err, results) => {
      if (err) {
        console.error('Error fetching master_product:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      // Map to group products by their IDs and calculate total hpp
      const productMap = new Map();

      results.forEach((row) => {
        const {
          id,
          name,
          price,
          hpp,
          material_qty,
          material_name,
          material_price,
        } = row;

        if (!productMap.has(id)) {
          productMap.set(id, {
            id,
            name,
            price,
            totalHpp: 0, // Initialize totalHpp
            margin: 0,
            details: [],
          });
        }

        const product = productMap.get(id);

        // Calculate the total hpp
        product.totalHpp += hpp;
        product.margin = price - product.totalHpp;
        // Add material details
        product.details.push({
          material_qty,
          material_name,
          material_price,
          hpp,
        });
      });

      // Convert the map to an array
      const productArray = Array.from(productMap.values());

      res.json({ products: productArray });
    }
  );
});

// POST product
router.post('/product', async (req, res) => {
  const { name, remark } = req.query;
  const sqlQuery = `INSERT INTO master_product (name,remark) VALUES (?,?)`;
  db.query(sqlQuery, [name, remark], (err, results) => {
    if (err) {
      console.error('Error insert master_product:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ product: results });
  });
});

// PUT product
router.put('/product', async (req, res) => {
  const { id, name, remark } = req.query;
  const sqlQuery = `UPDATE master_product SET name=?, remark=? WHERE id=?`;
  db.query(sqlQuery, [name, remark, id], (err, results) => {
    if (err) {
      console.error('Error update master_product:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ product: results });
  });
});

// DELETE product
router.delete('/product', async (req, res) => {
  const { id } = req.query;
  const sqlQuery = `DELETE FROM master_product WHERE id=?`;
  db.query(sqlQuery, [id], (err, results) => {
    if (err) {
      console.error('Error delete master_product:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ product: results });
  });
});

module.exports = router;
