const log = require("debug")("apollo:graphql:controller:returnBook");
const logError = log.extend("error");

const returnBook = {
  init: async (args, dataSources) => {
    const fromUserId = args.loggedUserId;
    const bookId = args.bookId;
    // check if user has the book to Return
    const ok = await returnBook.ownTheBook(fromUserId, bookId, dataSources);
    if (ok) {
      return returnBook.updateDb(fromUserId, bookId, dataSources);
    }
  },

  ownTheBook: async (userId, bookId, dataSources) => {
    const borrowedBooks = await dataSources.userAPI.getBorrowedBooks(userId);

    log("ownTheBook(): %O", borrowedBooks);

    let borrower = false;
    borrowedBooks.forEach((elem) => {
      log(elem.book);
      log({ bookId });
      if (elem.book.toString() === bookId.toString()) {
        if (elem.returnedAt === null) {
          borrower = true;
        }
      }
    });
    return returnBook.resolve(borrower);
  },

  resolve: async (borrower) => {
    logError({ borrower });
    if (borrower) {
      return true;
    } else {
      const error = new Error("User did not borrow this book");
      throw error;
    }
  },

  updateDb: async (userId, bookId, dataSources) => {
    logError({ userId });
    const borrowedBooks = await dataSources.userAPI.getBorrowedBooks(userId);

    log("updateDB(): %O", borrowedBooks);

    let bookLoanId;
    borrowedBooks.forEach((elem) => {
      const elemBookId = elem.book;
      if (elemBookId.toString() == bookId.toString()) {
        log({ elemBookId, bookId });
        bookLoanId = elem.id;
      }
    });

    const formattedBookLoan = await dataSources.bookLoanAPI.updateBookLoan(
      bookLoanId
    );
    log("updateDB(): formatted-bookloan %O", formattedBookLoan);

    // update user.lentBooks
    await dataSources.userAPI.deleteUserLentBook(
      formattedBookLoan.fromUser,
      formattedBookLoan.id
    );

    // update user.borrowedBooks
    await dataSources.userAPI.deleteUserBorrowedBooks(
      formattedBookLoan.toUser,
      formattedBookLoan.id
    );

    const result = await dataSources.bookLoanAPI.getBookLoan(
      formattedBookLoan.id
    );

    return result;
  },
};

module.exports = returnBook;
