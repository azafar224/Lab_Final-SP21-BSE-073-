const Book = require("../models/Book");
const Borrower = require("../models/Borrower");

// Borrow book logic
async function borrowBook(req, res) {
  const { borrowerId, bookId } = req.body;
  try {
    const borrower = await Borrower.findById(borrowerId);
    const book = await Book.findById(bookId);

    if (!borrower || !book)
      return res.status(404).json({ message: "Book or Borrower not found" });

    if (
      borrower.borrowedBooks.length >=
      (borrower.membershipType === "Premium" ? 10 : 5)
    ) {
      return res
        .status(400)
        .json({ message: "Borrower has reached their borrowing limit" });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: "No available copies" });
    }

    book.availableCopies -= 1;
    borrower.borrowedBooks.push(book);
    await book.save();
    await borrower.save();

    res.json({ message: "Book borrowed successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Return book logic
async function returnBook(req, res) {
  const { borrowerId, bookId } = req.body;
  try {
    const borrower = await Borrower.findById(borrowerId);
    const book = await Book.findById(bookId);

    if (!borrower || !book)
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
}

module.exports = { borrowBook, returnBook };
