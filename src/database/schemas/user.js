const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: new Date().toISOString(), required: true },
  collectionBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "book" }],
  lentBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "bookloan" }],
  borrowedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "bookloan" }],
});

module.exports = userSchema;
