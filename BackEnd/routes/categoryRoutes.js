const express = require('express');
const router = express.Router();
const { getAllCategories } = require('../controllers/categoryController');

// Public route to get all categories
router.get('/', getAllCategories);

module.exports = router;
