const express = require('express');
const Note = require('../models/noteModels.js');
const authController = require('../controllers/authController');
const authenticateToken = require('../middlewares/authMiddleware');
const router = express.Router();
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);

router.get('/logout', authController.logout);

router.get('/dashboard', authenticateToken, async (req, res) => {
    const notes = await Note.find({ userId: req.user.id });
    res.render('dashboard', { user: req.user , notes: notes },);
});

module.exports = router;
