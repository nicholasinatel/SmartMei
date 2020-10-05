const mongoose = require("mongoose");

const bookLoanSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: "book", required: true },
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  lentAt: { type: Date, default: new Date().toISOString(), required: true },
  returnedAt: { type: Date, default: new Date().toISOString() },
});

module.exports = bookLoanSchema;
