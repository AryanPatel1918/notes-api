const express = require('express')
const app = express()
const PORT = 3000

// Middleware to parse JSON request bodies
app.use(express.json())

// Temporary in-memory data
let notes = [
  { id: 1, title: "Shopping List", content: "Milk, Eggs, Bread" },
  { id: 2, title: "Workout Plan", content: "Run 5km, Pushups" },
  { id: 3, title: "Dinner Items", content: "Pizza, Pepsi" }
]
let nextId = 3

app.get('/', (req, res) => {
  res.send("Welcome to Notes API")
})

app.get('/notes', (req, res) => {
  res.json(notes)
})

app.get('/notes/:id', (req, res) => {
  const { id } = req.params
  const note = notes.find(note => note.id === Number(id))
  if (!note) {
    return res.status(404).json({ error: `Note with id of ${id} not found` })
  }
  res.json(note)
})

app.post('/notes', (req, res) => {
  const { title, content } = req.body
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" })
  }
  const newNote = { id: nextId++, title, content }
  notes.push(newNote)
  res.status(201).json(newNote)
})

app.put('/notes/:id', (req, res) => {
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
  res.json(note)
})

app.delete('/notes/:id', (req, res) => {
  const { id } = req.params
  const note = notes.find(note => note.id === Number(id))
  if (!note) {
    return res.status(404).json({ error: `Note with id of ${id} not found` })
  }

  notes = notes.filter(note => note.id !== Number(id))
  res.json(note)
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})