const express = require('express');
const { register, login, getMe, updateProfile } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Routes publiques
router.post('/register', register);
router.post('/login', login);

// Routes protégées
router.get('/me', authenticate, getMe);
router.put('/update-profile', authenticate, updateProfile);

module.exports = router;