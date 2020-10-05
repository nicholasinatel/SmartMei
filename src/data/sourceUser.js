const log = require("debug")("apollo:dataSources:user");
const logError = log.extend("error");

const { DataSource } = require("apollo-datasource");

const UserFormat = require("./utils/user");
const BookFormat = require("./utils/book");
const BookLoanFormat = require("./utils/bookLoan");
const format = require("./utils/gncObj");

class UserAPI extends DataSource {
  constructor({ Users }) {
    super();
    this.Users = Users;
  }

  initialize(config) {
    this.context = config.context;
  }

  async findUser({ id }) {
    const popLentBooks = {
      path: "lentBooks",
      populate: { path: "book" },
    };

    const popBorrowedBooks = {
      path: "borrowedBooks",
      populate: { path: "book" },
    };

    const userDb = await this.Users.findById(id)
      .populate("collectionBooks")
      .populate(popLentBooks)
      .populate(popBorrowedBooks);

    const collectionBooks = await BookFormat(userDb.collectionBooks);
    const lentBooks = await BookLoanFormat(userDb.lentBooks);
    const borrowedBooks = await BookLoanFormat(userDb.borrowedBooks);
    const user = await UserFormat(
      userDb,
      collectionBooks,
      lentBooks,
      borrowedBooks
    );
    return user;
  }
}

module.exports = UserAPI;
