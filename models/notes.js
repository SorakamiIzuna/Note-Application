const fs = require('fs');

// Đọc ghi chú từ file JSON
const loadNotes = () => {
  try {
    const dataBuffer = fs.readFileSync('./notes.json');
    return JSON.parse(dataBuffer.toString());
  } catch (e) {
    return [];
  }
};

// Lưu ghi chú vào file JSON
const saveNotes = (notes) => {
  fs.writeFileSync('./notes.json', JSON.stringify(notes, null, 2));
};

// Lấy tất cả ghi chú
const getAllNotes = () => {
  return loadNotes();
};

// Thêm ghi chú mới
const addNote = (title, shared) => {
  const notes = loadNotes();
  const newNote = { id: Date.now().toString(), title, shared: shared || false };
  notes.push(newNote);
  saveNotes(notes);
  return newNote;
};

// Xóa ghi chú
const deleteNote = (id) => {
  const notes = loadNotes();
  const filteredNotes = notes.filter((note) => note.id !== id);
  saveNotes(filteredNotes);
};

// Hủy chia sẻ ghi chú
const unshareNote = (id) => {
  const notes = loadNotes();
  const updatedNotes = notes.map((note) =>
    note.id === id ? { ...note, shared: false } : note
  );
  saveNotes(updatedNotes);
};

module.exports = { getAllNotes, addNote, deleteNote, unshareNote };
