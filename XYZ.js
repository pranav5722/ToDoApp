// === Backend: Node.js with Express (index.js) ===
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let notes = [];

// GET /api/notes - List all notes
app.get('/api/notes', (req, res) => {
  res.json(notes);
});

// POST /api/notes - Create a new note
app.post('/api/notes', (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) {
    return res.status(400).json({ error: 'Title and body are required.' });
  }
  const newNote = { id: uuidv4(), title, body };
  notes.push(newNote);
  res.status(201).json(newNote);
});

// DELETE /api/notes/:id - Delete a note by ID
app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  const index = notes.findIndex(note => note.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Note not found.' });
  }
  notes.splice(index, 1);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});