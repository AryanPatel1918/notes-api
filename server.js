const express = require('express')
const app = express()
const PORT = 3000

const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, 'notes.json')

// Read notes from file
function loadNotes() {
  if (!fs.existsSync(filePath)) { // check if notes.json exists
    return []
  }
  try {
    const data = fs.readFileSync(filePath, 'utf8')
    return data ? JSON.parse(data) : []
  } catch (err) {
    console.error("Failed to parse notes.json", err)
    return []
  }
}

function saveNotes(notes) {
  fs.writeFileSync(filePath, JSON.stringify(notes, null, 2))
}

// Middleware to parse JSON request bodies
app.use(express.json())

// no need since notes get loaded in every method
// let notes = loadNotes()

app.get('/', (req, res) => {
  res.send("Welcome to Notes API")
})

app.get('/notes', (req, res) => {
  res.json(loadNotes())
})

app.get('/notes/:id', (req, res) => {
  const notes = loadNotes() // reload latest in the case of manually editing notes.json
  const { id } = req.params
  const note = notes.find(note => note.id === Number(id))
  if (!note) {
    return res.status(404).json({ error: `Note with id of ${id} not found` })
  }
  res.json(note)
})

app.post('/notes', (req, res) => {
  const notes = loadNotes() // reload latest in the case of manually editing notes.json
  const nextId = notes.length ? Math.max(...notes.map(note => note.id)) + 1 : 1
  const { title, content } = req.body
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" })
  }
  const newNote = { id: nextId, title, content }
  notes.push(newNote)
  saveNotes(notes)
  res.status(201).json(newNote)
})

app.put('/notes/:id', (req, res) => {
  const notes = loadNotes() // reload latest in the case of manually editing notes.json
  const { id } = req.params
  const note = notes.find(note => note.id === Number(id))
  if (!note) {
    return res.status(404).json({ error: `Note with id of ${id} not found` })
  }

  const { title, content } = req.body
  if (title) {
    note.title = title
  }
  if (content) {
    note.content = content
  }
  saveNotes(notes)
  res.json(note)
})

app.delete('/notes/:id', (req, res) => {
  let notes = loadNotes() // reload latest in the case of manually editing notes.json
  const { id } = req.params
  const note = notes.find(note => note.id === Number(id))
  if (!note) {
    return res.status(404).json({ error: `Note with id of ${id} not found` })
  }

  notes = notes.filter(note => note.id !== Number(id))
  saveNotes(notes)
  res.json(note)
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})