const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');

// Route để liệt kê ghi chú
router.get('/', notesController.listNotes);

// Route để thêm ghi chú
router.post('/create', notesController.createNote);

// Route để xóa ghi chú
router.post('/:id/delete', notesController.deleteNote);

// Route để hủy chia sẻ ghi chú
router.post('/:id/unshare', notesController.unshareNote);

module.exports = router;
