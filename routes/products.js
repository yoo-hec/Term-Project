const express = require('express');
const db = require('../db/database');
const router = express.Router();

// /product - show all products
router.get('/', (req, res) => {
    db.all('SELECT * FROM products', (err, products) => {
      if (err) return res.status(500).send('Database error');
      res.render('products', { products });  // Use 'products.pug'
    });
  });
  

// Show individual product
router.get('/:id', (req, res) => {
    const productId = req.params.id;
    db.get(`SELECT * FROM products WHERE id = ?`, [productId], (err, product) => {
        if (!product) return res.status(404).send('Product not found');
        res.render('product', { product });
    });
});

module.exports = router;