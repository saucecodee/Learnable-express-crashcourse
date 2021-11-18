const express = require('express')
const mongoose = require('mongoose');
const dbUtil = require("./lib/dbUtil")
const helper = require("./lib/helper")

const app = express()
const port = 3000

let count = 0

// Connect to MongoDB
async function connectToMongoDB() {
  await mongoose.connect('mongodb://localhost:27017/book-store');
  console.log(":: Connected to MongoDB server")
}
connectToMongoDB()


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/ping', (req, res) => {
  count++
  res.send(`There has been ${count} request since the server started`)
})

app.get('/books', async (req, res) => {
  try {
    const data = await dbUtil.getAllBooks()
    res.status(200).send({ message: 'Books retrieved', data: data })
  } catch (error) {
    res.status(404).send({ err: error, message: 'Could not retrieve books' })
  }
})

app.get('/books/:book_id', async (req, res) => {
  const book_id = req.params.book_id
  try {
    const data = await dbUtil.getOneBook(book_id)
    res.status(200).send({ message: 'Book retrieved', data: data })
  } catch (error) {
    res.status(404).send({ err: error, message: 'Could not retrieve book' })
  }
})

app.post("/books", async (req, res) => {
  const data = req.body

  try {
    await dbUtil.createBook(data)
    res.status(200).send({ message: "book added successfully", data: null })
  } catch (error) {
    res.status(400).send({ message: "could add book" })
  }
})

app.put("/books/:book_id", async (req, res) => {
  const data = req.body
  const book_id = req.params.book_id

  try {
    await dbUtil.updateBook(book_id, data)
    res.status(200).send({ message: 'Book updated successfully' })
  } catch (error) {
    res.status(404).send({ err: error, data: null, message: 'Could not update book' })
  }
})

app.delete("/books/:book_id", async (req, res) => {
  const book_id = req.params.book_id

  try {
    await dbUtil.deleteBook(book_id)
    res.status(200).send({ message: 'Book deleted successfully' })
  } catch (error) {
    res.status(400).send({ err: error, message: 'Could not delete book' })
  }
})

app.use('**', (req, res) => {
  res.status(404).send("Route not found")
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})