const Borrower = require("../models/Borrower");
const Book = require("../models/Book");

exports.addBorrower = async (req, res) => {
  try {
    const borrower = new Borrower(req.body);
    await borrower.save();
    res.status(201).json(borrower);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.borrowBook = async (req, res) => {
  try {
    const { borrowerId, bookId } = req.body;
    const borrower = await Borrower.findById(borrowerId).populate(
      "borrowedBooks"
    );
    const book = await Book.findById(bookId);

    if (!borrower || !book)
      return res.status(404).json({ error: "Borrower or Book not found" });
    if (!borrower.membershipActive)
      return res.status(400).json({ error: "Inactive membership" });
    if (!borrower.canBorrow())
      return res.status(400).json({ error: "Borrowing limit reached" });
    if (book.availableCopies < 1)
      return res.status(400).json({ error: "No copies available" });

    borrower.borrowedBooks.push(book._id);
    book.availableCopies -= 1;
    await borrower.save();
    await book.save();

    res.json({ message: "Book borrowed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const { borrowerId, bookId } = req.body;
    const borrower = await Borrower.findById(borrowerId).populate(
      "borrowedBooks"
    );
    const book = await Book.findById(bookId);

    if (!borrower || !book)
      return res.status(404).json({ error: "Borrower or Book not found" });

    const bookIndex = borrower.borrowedBooks.findIndex((b) =>
      b._id.equals(book._id)
    );
    if (bookIndex === -1)
      return res
        .status(400)
        .json({ error: "Book not borrowed by this borrower" });

    borrower.borrowedBooks.splice(bookIndex, 1);
    book.availableCopies += 1;
    await borrower.save();
    await book.save();

    res.json({ message: "Book returned successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
