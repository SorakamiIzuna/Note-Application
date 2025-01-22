const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/', authenticateToken ,noteController.index);
router.get('/add',authenticateToken, noteController.addNoteForm);
router.post('/add',authenticateToken, noteController.createNote);
router.get('/edit/:id',authenticateToken, noteController.editNoteForm);
router.post('/edit/:id',authenticateToken, noteController.updateNote);
router.get('/delete/:id',authenticateToken, noteController.deleteNote);

module.exports = router;
