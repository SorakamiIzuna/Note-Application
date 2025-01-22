const mongoose = require('mongoose');

// Định nghĩa Schema cho ghi chú
const noteSchema = new mongoose.Schema({
  creator: {
    type: String,
    required: true,
  },
  title:{
    type:String,
    require: true,
  },
  content: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  access_token: {
    type: String,
    required: true,
  },
  expired: {
    type: Date,
    default: new Date(0), // Chưa hết hạn mặc định
  },
});

// Tạo Model Note từ Schema
const Note = mongoose.model('Note', noteSchema, 'Note');

module.exports = Note;
