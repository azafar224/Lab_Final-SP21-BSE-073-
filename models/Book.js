const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
    required: true,
  },
  isbn: { type: String, unique: true, required: true },
  availableCopies: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: function (value) {
        return !(this.borrowingFrequency > 10 && value > 100);
      },
      message:
        "Available copies cannot exceed 100 if borrowing frequency is above 10.",
    },
  },
  borrowingFrequency: { type: Number, default: 0 },
});

// Prevent re-compiling the model
module.exports = mongoose.models.Book || mongoose.model("Book", bookSchema);
