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
  async checkUser(id) {
    const userExists = await this.Users.findById(id);
    if (userExists === null) return false;
    if (userExists) return true;
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

    log("findUser: %O", userDb);

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

  async createUser(input) {
    const userEmail = input.email.toString();
    const userExist = await this.Users.findOne({ email: userEmail });
    log({ userExist });

    if (userExist) {
      const error = new Error("User already exists");
      error.data = { id: userExist._id };
      throw error;
    } else {
      log("Creating New User");
      const userName = input.name.toString();
      // Create User
      const UserModel = this.Users.model("user");
      const newUser = new UserModel({
        name: userName,
        email: userEmail,
      });
      const createdUser = await newUser.save();
      // Return Entire User
      return createdUser;
    }
  }

  async updateUserBookCollection(id, book) {
    let user = await this.Users.findById(id);
    user.collectionBooks.push(book._id);
    await user.save();
  }

  async updateUserLentBooks(id, bookId) {
    let user = await this.Users.findById(id);
    user.lentBooks.push(bookId);
    const update = await user.save();
  }

  async updateUserBorrowedBooks(id, bookId) {
    let user = await this.Users.findById(id);
    user.borrowedBooks.push(bookId);
    const update = await user.save();
    log("Update Borrowed Books: %O", update);
  }

  async deleteUserLentBook(id, bookLoanId) {
    let user = await this.Users.findById(id);

    const lentBooks = user.lentBooks;
    let nuLentBooks = [];

    log("deleteUserLentBook(): old-lent-books %O", lentBooks);

    lentBooks.forEach((elem) => {
      if (elem.toString() != bookLoanId.toString()) {
        nuLentBooks.push(elem);
      }
    });

    log("deleteUserLentBook(): new-lent-books %O", nuLentBooks);

    user.lentBooks = nuLentBooks;
    user.save();
  }

  async deleteUserBorrowedBooks(id, bookLoanId) {
    let user = await this.Users.findById(id);
    const borrowedBooks = user.borrowedBooks;
    let nuBorrowedBooks = [];

    log("deleteUserBorrowedBook(): old-borrowed-books %O", borrowedBooks);

    borrowedBooks.forEach((elem) => {
      if (elem.toString() != bookLoanId.toString()) nuBorrowedBooks.push(elem);
    });

    log("deleteUserBorrowedBook(): nu-borrowed-books %O", nuBorrowedBooks);

    user.borrowedBooks = nuBorrowedBooks;
    user.save();
  }

  async collectionBooks(id) {
    const user = await this.Users.findById(id).populate("collectionBooks");
    return user;
  }

  async getLentBooks(userId) {
    const { lentBooks } = await this.findUser(userId);
    return lentBooks;
  }

  async getBorrowedBooks(userId) {
    const { borrowedBooks } = await this.Users.findById(userId).populate(
      "borrowedBooks"
    );

    log("getBorrowedBooks(): %O", borrowedBooks);

    let formattedBorrowedBooks = [];
    borrowedBooks.forEach((elem) => {
      formattedBorrowedBooks.push(format(elem));
    });

    return formattedBorrowedBooks;
  }
}

module.exports = UserAPI;
