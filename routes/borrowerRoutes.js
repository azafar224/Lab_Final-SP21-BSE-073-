const express = require("express");
const router = express.Router();
const Borrower = require("../models/Borrower");
const Book = require("../models/Book");

// Add a new borrower
router.post("/", async (req, res) => {
  try {
    const borrower = new Borrower(req.body);
    await borrower.save();
    res.status(201).json(borrower);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all borrowers
router.get("/", async (req, res) => {
  try {
    const borrowers = await Borrower.find().populate("borrowedBooks");
    res.status(200).json(borrowers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific borrower
router.get("/:id", async (req, res) => {
  try {
    const borrower = await Borrower.findById(req.params.id).populate(
      "borrowedBooks"
    );
    if (!borrower) {
      return res.status(404).json({ message: "Borrower not found" });
    }
    res.status(200).json(borrower);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a borrower
router.put("/:id", async (req, res) => {
  try {
    const borrower = await Borrower.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!borrower) {
      return res.status(404).json({ message: "Borrower not found" });
    }
    res.status(200).json(borrower);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a borrower
router.delete("/:id", async (req, res) => {
  try {
    const borrower = await Borrower.findByIdAndDelete(req.params.id);
    if (!borrower) {
      return res.status(404).json({ message: "Borrower not found" });
    }
    res.status(200).json({ message: "Borrower deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Borrow a book
router.post("/borrow", async (req, res) => {
  try {
    const { borrowerId, bookId } = req.body;
    const borrower = await Borrower.findById(borrowerId);
    const book = await Book.findById(bookId);

    if (!book || !borrower)
      return res.status(404).json({ message: "Book or Borrower not found" });

    const borrowingLimit = borrower.membershipType === "Premium" ? 10 : 5;
    if (borrower.borrowedBooks.length >= borrowingLimit) {
      return res.status(400).json({
        message: `Borrower has reached their borrowing limit of ${borrowingLimit} books`,
      });
    }

    if (book.availableCopies <= 0) {
      return res
        .status(400)
        .json({ message: "No available copies of the book" });
    }

    book.availableCopies -= 1;
    borrower.borrowedBooks.push(book);
    await book.save();
    await borrower.save();

    res.json({ message: "Book borrowed successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Return a book
router.post("/return", async (req, res) => {
  try {
    const { borrowerId, bookId } = req.body;
    const borrower = await Borrower.findById(borrowerId);
    const book = await Book.findById(bookId);

    if (!book || !borrower)
      return res.status(404).json({ message: "Book or Borrower not found" });

    borrower.borrowedBooks = borrower.borrowedBooks.filter(
      (b) => b.toString() !== bookId
    );
    book.availableCopies += 1;

    await book.save();
    await borrower.save();

    res.json({ message: "Book returned successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
