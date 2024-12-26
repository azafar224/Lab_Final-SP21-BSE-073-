const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Author = require("../models/Author");
const Book = require("../models/Book");
const Borrower = require("../models/Borrower");

const populateData = async () => {
  await connectDB();

  try {
    // Clear existing data
    await Author.deleteMany();
    await Book.deleteMany();
    await Borrower.deleteMany();

    // Add authors
    const authors = await Author.insertMany([
      {
        name: "Ahmad Zafar",
        email: "ahmadzafar224@example.com",
        phoneNumber: "1234567890",
      },
      {
        name: "Ali Hassan",
        email: "ah2@example.com",
        phoneNumber: "0987654321",
      },
      {
        name: "Ahmad test",
        email: "ahmadtest@example.com",
        phoneNumber: "1122334455",
      },
    ]);

    // Add books
    const books = await Book.insertMany([
      {
        title: "Book One",
        author: authors[0]._id,
        isbn: "111111",
        availableCopies: 5,
      },
      {
        title: "Book Two",
        author: authors[1]._id,
        isbn: "222222",
        availableCopies: 3,
      },
      {
        title: "Book Three",
        author: authors[2]._id,
        isbn: "333333",
        availableCopies: 8,
      },
    ]);

    // Add borrowers
    await Borrower.insertMany([
      {
        name: "Borrower One",
        borrowedBooks: [books[0]._id],
        membershipActive: true,
        membershipType: "Standard",
      },
      {
        name: "Borrower Two",
        borrowedBooks: [],
        membershipActive: true,
        membershipType: "Premium",
      },
      {
        name: "Borrower Three",
        borrowedBooks: [books[1]._id],
        membershipActive: false,
        membershipType: "Standard",
      },
    ]);

    console.log("Test data populated successfully!");
  } catch (err) {
    console.error(err.message);
  } finally {
    mongoose.connection.close();
  }
};

populateData();
