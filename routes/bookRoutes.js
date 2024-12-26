const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const Author = require("../models/Author");

// Add new book
router.post("/", async (req, res) => {
  try {
    const { author, isbn } = req.body;
    const authorObj = await Author.findById(author);

    if (!authorObj)
      return res.status(404).json({ message: "Author not found" });

    // Check if the author is linked to more than 5 books
    const booksCount = await Book.countDocuments({ author });
    if (booksCount >= 5)
      return res
        .status(400)
        .json({ message: "Author can only be linked to 5 books" });

    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find().populate("author");
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific book by ID
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("author");
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update book
router.put("/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete book
router.delete("/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
