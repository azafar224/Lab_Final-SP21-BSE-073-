const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true, match: /.+\@.+\..+/ },
  phoneNumber: { type: String, required: true, match: /^[0-9]{10}$/ },
});

authorSchema.virtual("books", {
  ref: "Book",
  localField: "_id",
  foreignField: "author",
});

module.exports = mongoose.model("Author", authorSchema);
