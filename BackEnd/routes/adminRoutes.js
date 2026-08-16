const express = require('express');
const router = express.Router();
const { verifyAdminToken } = require('../middleware/adminAuth');

const { getDashboardStats } = require('../controllers/adminController');
const { getAllCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { createBook, updateBook, deleteBook } = require('../controllers/bookController');

// All routes here are protected by admin authentication
router.use(verifyAdminToken);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Categories
router.get('/categories', getAllCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Books (Admin needs to create/update/delete)
router.post('/books', createBook);
router.put('/books/:id', updateBook);
router.delete('/books/:id', deleteBook);

module.exports = router;
