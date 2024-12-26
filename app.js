const express = require("express");
const mongoose = require("mongoose");
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Import routes
const bookRoutes = require("./routes/bookRoutes");
const authorRoutes = require("./routes/authorRoutes");
const borrowerRoutes = require("./routes/borrowerRoutes");
const borrowRoutes = require("./routes/borrowRoutes");

// Use routes
app.use("/books", bookRoutes);
app.use("/authors", authorRoutes);
app.use("/borrowers", borrowerRoutes);
app.use("/", borrowRoutes);

// MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/library", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
