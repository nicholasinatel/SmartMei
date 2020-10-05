const mongoose = require("mongoose");

const BookSchema = require("./../schemas/book");

const BookModel = mongoose.model("book", BookSchema);

module.exports = BookModel;
