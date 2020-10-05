const mongoose = require("mongoose");

const BookLoanSchema = require("./../schemas/bookLoan");

const BookLoanModel = mongoose.model("bookloan", BookLoanSchema);

module.exports = BookLoanModel;