const express = require('express');
const Note = require('../models/noteModels.js');
const authController = require('../controllers/authController');
const authenticateToken = require('../middlewares/authMiddleware');
const router = express.Router();
const noteController = require('../controllers/noteController.js')
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);

router.get('/logout', authController.logout);

router.get('/dashboard', authenticateToken,noteController.getNote);

module.exports = router;
