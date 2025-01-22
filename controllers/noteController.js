// controllers/noteController.js
const Note = require('../models/noteModels.js');

// Show all notes
exports.index = async (req, res) => {
  try {
    const notes = await Note.find();
    res.render('index', { notes });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Show the form to add a new note
exports.addNoteForm = (req, res) => {
  res.render('addNote',{user:req.user});
};

// Create a new note
exports.createNote = async (req, res) => {
  const { title, content } = req.body;
  try {
    const user = req.user.username
    const token = "accessToken"
    const newNote = new Note({ creator:user, title, content, access_token:token});
    await newNote.save();
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Show the form to edit a note
exports.editNoteForm = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send('Note not found');
    }
    res.render('editNote', { note });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Update a note
exports.updateNote = async (req, res) => {
  const { title, content } = req.body;
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
    if (!note) {
      return res.status(404).send('Note not found');
    }
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Delete a note
exports.deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
exports.shareNote = async (req,res) =>{

}
