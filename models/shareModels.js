const mongoose = require('mongoose');

// Định nghĩa Schema cho ghi chú
const shareSchema = new mongoose.Schema({
  note_id: {
    type: String,
    required: true,
  },
  url:{
    type:String,
    require: true,
  },
});

// Tạo Model Note từ Schema
const shareNote = mongoose.model('Share', shareSchema, 'Share');

module.exports = shareNote;