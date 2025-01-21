const notesModel = require('../models/notes');

// Liệt kê tất cả ghi chú
const listNotes = (req, res) => {
  const notes = notesModel.getAllNotes();
  res.render('list', { notes });
};

// Thêm ghi chú mới
const createNote = (req, res) => {
  const { title, shared } = req.body;
  notesModel.addNote(title, shared === 'on');
  res.redirect('/notes');
};

// Xóa ghi chú
const deleteNote = (req, res) => {
  const { id } = req.params;
  notesModel.deleteNote(id);
  res.redirect('/notes');
};

// Hủy chia sẻ ghi chú
const unshareNote = (req, res) => {
  const { id } = req.params;
  notesModel.unshareNote(id);
  res.redirect('/notes');
};

module.exports = { listNotes, createNote, deleteNote, unshareNote };
