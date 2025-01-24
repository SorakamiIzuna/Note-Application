// controllers/noteController.js
const Note = require('../models/noteModels.js');
const share = require('../models/shareModels.js')
const cryptoUtils = require('../models/aes.js')
const crypto = require('crypto');
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
    const user = req.user.username;

    // Generate a session key (store securely or use a shared key)
    const sessionKey = cryptoUtils.generateSessionKeys();

    // Generate a unique key for the note using its ID (placeholder for now)
    const noteId = crypto.randomBytes(16).toString('hex'); // Simulating a unique note ID
    const uniqueKey = cryptoUtils.generateUniqueKeyForNote(sessionKey, noteId);

    // Encrypt the note content
    const encryptedData = cryptoUtils.encryptNote(content, uniqueKey);

    // Save the encrypted note
    const newNote = new Note({
      _id:noteId,
      creator: user,
      title,
      content: encryptedData.encryptedNote, // Save encrypted content
      iv: encryptedData.iv, // Save the IV
      access_token: sessionKey.toString('hex'), // Save the session key securely
    });
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
    const sessionKey = Buffer.from(note.access_token, 'hex');
      const uniqueKey = cryptoUtils.generateUniqueKeyForNote(sessionKey, note._id.toString());
      const decryptedContent = cryptoUtils.decryptNote(
        { encryptedNote: note.content, iv: note.iv },
        uniqueKey
      );
    const decryptedNote = new Note({
      _id:note.id,
      creator:note.creator,
      title:note.title,
      content:decryptedContent,
      iv: note.iv, // Save the IV
      access_token: note.access_token,
    })
    res.render('editNote', { note: decryptedNote });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Update a note
exports.updateNote = async (req, res) => {
  const { title, content } = req.body;
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send('Note not found');
    }

    // Retrieve session key and generate a unique key
    const sessionKey = Buffer.from(note.access_token, 'hex');
    const uniqueKey = cryptoUtils.generateUniqueKeyForNote(sessionKey, note._id.toString());

    // Encrypt the updated content
    const encryptedData = cryptoUtils.encryptNote(content, uniqueKey);

    // Update the note with encrypted content
    note.title = title;
    note.content = encryptedData.encryptedNote;
    note.iv = encryptedData.iv;
    await note.save();

    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status
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
exports.getNote = async (req, res) => {
  try {
    const notes = await Note.find({creator:req.user.username});

    // Decrypt each note
    const decryptedNotes = notes.map((note) => {
      // Retrieve session key and IV
      const sessionKey = Buffer.from(note.access_token, 'hex');
      const uniqueKey = cryptoUtils.generateUniqueKeyForNote(sessionKey, note._id.toString());
      const decryptedContent = cryptoUtils.decryptNote(
        { encryptedNote: note.content, iv: note.iv },
        uniqueKey
      );

      return {
        ...note.toObject(),
        content: decryptedContent, // Replace encrypted content with decrypted content
      };
    });

    res.render('dashboard', { user: req.user, notes: decryptedNotes });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

