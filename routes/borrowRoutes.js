const express = require("express");
const router = express.Router();
const { borrowBook, returnBook } = require("../controllers/borrowController");

// Route to borrow a book
router.post("/borrow", borrowBook);

// Route to return a book
router.post("/return", returnBook);

module.exports = router;
