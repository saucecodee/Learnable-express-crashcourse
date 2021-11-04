const express = require('express')
const fileUtil = require("./lib/fileUtil")
const helper = require("./lib/helper")

const app = express()
const port = 3000

let count = 0

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/ping', (req, res) => {
  count++
  res.send(`There has been ${count} request since the server started`)
})

app.get('/books/:book_id', (req, res) => {
  const book_id = req.params.book_id

  if (book_id) {
    fileUtil.read('books', book_id, (err, data) => {
      if (!err && data) {
        res.status(200).send({ message: 'Book retrieved', data: data })
      } else {
        res.status(404).send({ err: err, data: data, message: 'Could not retrieve book' })
      }
    });
  } else {
    res.status(400).send({ message: 'Book id is required', data: null })
  }
})

app.post("/books", (req, res) => {
  const data = req.body
  //validate that all required fields are filled out
  var name = typeof (data.name) === 'string' && data.name.trim().length > 0 ? data.name : false;
  var price = typeof (data.price) === 'string' && !isNaN(parseInt(data.price)) ? data.price : false;
  var author = typeof (data.author) === 'string' && data.author.trim().length > 0 ? data.author : false;
  var publisher = typeof (data.publisher) === 'string' && data.publisher.trim().length > 0 ? data.publisher : false;

  if (name && price && author && publisher) {
    const fileName = helper.generateRandomString(30);
    fileUtil.create('books', fileName, data, (err) => {
      if (!err) {
        res.status(200).send({ message: "book added successfully", data: null })
      } else {
        res.status(400).send({ message: "could add book" })
      }
    });
  } else {
    res.status(400).send({ message: "Some fiedls are incorrect" })
  }
})

app.put("/books/:book_id", (req, res) => {
  const data = req.body
  const book_id = req.params.book_id

  if (book_id) {
    fileUtil.update('books', book_id, data, (err) => {
      if (!err) {
        res.status(200).send({ message: 'Book updated successfully' })
      } else {
        res.status(404).send({ err: err, data: null, message: 'Could not update book' })
      }
    });
  } else {
    res.status(404).send({ message: 'Book not found' })
  }
})

app.delete("/books/:book_id", (req, res) => {
  const book_id = req.params.book_id

  if (book_id) {
    fileUtil.delete('books', book_id, (err) => {
      if (!err) {
        res.status(200).send({ message: 'Book deleted successfully' })
      } else {
        res.status(400).send({ err: err, message: 'Could not delete book' })
      }
    })
  } else {
    res.status(404).send({ message: 'Book not found' })
  }
})

app.use('**', (req, res) => {
  res.status(404).send("Route not found")
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})