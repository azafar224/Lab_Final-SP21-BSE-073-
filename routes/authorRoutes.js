const express = require("express");
const router = express.Router();
const Author = require("../models/Author");
const Book = require("../models/Book");

// Add new author
router.post("/", async (req, res) => {
  try {
    const author = new Author(req.body);
    await author.save();
    res.status(201).json(author);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update author
router.put("/:id", async (req, res) => {
  try {
    const author = await Author.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!author) return res.status(404).json({ message: "Author not found" });
    res.json(author);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete author
router.delete("/:id", async (req, res) => {
  try {
    const author = await Author.findByIdAndDelete(req.params.id);
    if (!author) return res.status(404).json({ message: "Author not found" });

    // Ensure author has no linked books before deletion
    const books = await Book.find({ author: author._id });
    if (books.length > 0)
      return res
        .status(400)
        .json({ message: "Author has books linked to them. Cannot delete." });

    res.json({ message: "Author deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all authors
router.get("/", async (req, res) => {
  try {
    const authors = await Author.find();
    res.json(authors);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get authors linked to more than 5 books
router.get("/over-linked", async (req, res) => {
  try {
    const authors = await Author.find();
    const result = [];
    for (const author of authors) {
      const booksCount = await Book.countDocuments({ author: author._id });
      if (booksCount > 5) {
        result.push({ author, booksCount });
      }
    }
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
