const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

router.get('/', noteController.index);
router.get('/add', noteController.addNoteForm);
router.post('/add', noteController.createNote);
router.get('/edit/:id', noteController.editNoteForm);
router.post('/edit/:id', noteController.updateNote);
router.get('/delete/:id', noteController.deleteNote);

module.exports = router;
