const express = require('express');
const router = express.Router();
const Note = require('../models/noteModels.js');
const noteController = require('../controllers/noteController');
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/', noteController.index);
router.get('/add',authenticateToken, noteController.addNoteForm);
router.post('/add',authenticateToken, noteController.createNote);
router.get('/edit/:id',authenticateToken, noteController.editNoteForm);
router.post('/edit/:id',authenticateToken, noteController.updateNote);
router.get('/delete/:id',authenticateToken, noteController.deleteNote);
router.get('/share/:id',authenticateToken, noteController.shareNote);
router.get('/dashboard', authenticateToken, noteController.getNote);
router.get('/view/:id', noteController.viewSharedNote);
module.exports = router;
