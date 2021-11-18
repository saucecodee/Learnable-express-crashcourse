const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    default: 1000
  },
  author: {
    type: String,
    required: true,
  },
  publisher: {
    type: String,
    required: true,
  },
  isbn_number: {
    type: String,
    required: true,
  },
  cover_image_url: {
    type: String,
    required: true,
  }
});

const Books = mongoose.model('book', bookSchema)

exports.createBook = async (data) => {
  return await new Books(data).save();
}

exports.getAllBooks = async () => {
  return await Books.find({});
}

exports.getOneBook = async (booksId) => {
  const books = await Books.findOne({ _id: booksId });
  if (!books) throw new Error("Books does not exists");

  return books
}

exports.updateBook = async (booksId, data) => {
  const books = await Books.findByIdAndUpdate(
    { _id: booksId },
    { $set: data }
  );

  if (!books) throw new Error("Books dosen't exist", 404);

  return books;
}

exports.deleteBook = async (booksId) => {
  const books = await Books.findOne({ _id: booksId });
  books.remove()
  return books
}
