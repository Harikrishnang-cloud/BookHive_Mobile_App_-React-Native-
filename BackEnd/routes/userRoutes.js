const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const { syncUser } = require('../controllers/userController');

const router = express.Router();

router.post('/sync', verifyToken, syncUser);

module.exports = router;
