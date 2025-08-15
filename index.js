const express = require('express')
const app = express()
const PORT = 3000

// Middleware to parse JSON request bodies
app.use(express.json())

// Temporary in-memory data
let notes = [
  { id: 1, title: "Shopping List", content: "Milk, Eggs, Bread" },
  { id: 2, title: "Workout Plan", content: "Run 5km, Pushups" }
];
let nextId = 3;

app.get('/', (req, res) => {
    res.send("Welcome to Notes API")
})



app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})