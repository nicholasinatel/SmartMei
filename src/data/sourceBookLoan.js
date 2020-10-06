const log = require("debug")("apollo:datasources:bookloan");
const logError = log.extend("error");

const { DataSource } = require("apollo-datasource");

const format = require("./utils/gncObj");

class BookLoanAPI extends DataSource {
  constructor({ BookLoans }) {
    super();
    this.BookLoans = BookLoans;
  }

  initialize(config) {
    this.context = config.context;
    this.BookLoanModel = this.BookLoans.model("bookloan");
  }

  async createBookLoan(fromUserId, toUserId, bookId) {
    const newBookLoan = new this.BookLoanModel({
      book: bookId,
      fromUser: fromUserId,
      toUser: toUserId,
      lentAt: new Date().toISOString(),
      returnedAt: null,
    });
    const savedBookLoan = await newBookLoan.save();
    const popBookLoan = await this.getBookLoan(savedBookLoan._id);
    return popBookLoan;
  }

  async updateBookLoan(bookLoanId) {
    logError({ bookLoanId });

    let bookLoan = await this.BookLoans.findById(bookLoanId);

    log("updateBookLoan -old-bookloan: %O", bookLoan);

    bookLoan.returnedAt = new Date().toISOString();
    let nuBookLoan = await bookLoan.save();

    log("updateBookLoan -nu-bookloan: %O", nuBookLoan);

    nuBookLoan = format(nuBookLoan);

    return nuBookLoan;
  }

  async getBookLoan(id) {
    const bookLoan = await this.BookLoans.findById(id).populate("book");
    log("getBookLoan(): %O", bookLoan);
    return format(bookLoan);
  }
}

module.exports = BookLoanAPI;
