const Author = require("../models/Author");
const Book = require("../models/Book");

exports.addAuthor = async (req, res) => {
  try {
    const author = new Author(req.body);
    await author.save();
    res.status(201).json(author);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateAuthor = async (req, res) => {
  try {
    const author = await Author.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!author) return res.status(404).json({ error: "Author not found" });
    res.json(author);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteAuthor = async (req, res) => {
  try {
    const books = await Book.find({ author: req.params.id });
    if (books.length > 0)
      return res
        .status(400)
        .json({ error: "Author linked to books cannot be deleted" });

    const author = await Author.findByIdAndDelete(req.params.id);
    if (!author) return res.status(404).json({ error: "Author not found" });
    res.json({ message: "Author deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
