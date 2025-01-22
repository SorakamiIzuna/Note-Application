// controllers/noteController.js
const Note = require('../models/noteModels.js');
const share = require('../models/shareModels.js')
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
    res.redirect('/dashboard');
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
  const user = req.user
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
    if (!note) {
      return res.status(404).send('Note not found');
    }
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Delete a note
exports.deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
exports.shareNote = async (req,res) =>{
  try{
    const note_id = req.params.id
    const url = "this is url"
    const shareNote = new share({note_id, url})
    await shareNote.save()
    res.redirect('/dashboard')
  } catch(err){
    console.error(err);
    res.status(500).send('Server Error');
  }
}
exports.getNote = async(req,res) =>{
  try{
    const notes = await Note.find();
    res.render('dashboard', { user: req.user , notes: notes },);
  }catch(err){
    onsole.error(err);
    res.status(500).send('Server Error');
  }
}
