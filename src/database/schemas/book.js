const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {type: String, required: true},
  pages: {type: Number, required: true},
  createdAt: { type: Date, default: new Date().toISOString(), required: true },
});

module.exports = bookSchema;
