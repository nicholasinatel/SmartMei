const log = require("debug")("apollo:graphql:controller:returnBook");
const logError = log.extend("error");

const returnBook = {
  init: async (args, dataSources) => {
    log("returnBook");
    const fromUserId = args.loggedUserId;
    const bookId = args.bookId;
    log({ fromUserId, bookId });
    // check if user has the book to Return
    const ok = await returnBook.ownTheBook(fromUserId, bookId, dataSources);
    if (ok) {
      return returnBook.updateDb(fromUserId, bookId, dataSources);
    }
  },

  ownTheBook: async (userId, bookId, dataSources) => {
    const borrowedBooks = await dataSources.userAPI.getBorrowedBooks({
      id: userId,
    });

    log({ borrowedBooks });

    let borrower = false;
    borrowedBooks.forEach((elem) => {
      if (elem.book.id == bookId) borrower = true;
    });
    return returnBook.resolve(borrower);
  },

  resolve: async (borrower) => {
    if (borrower) {
      return true;
    } else {
      const error = new Error("User did not borrow this book");
      throw error;
    }
  },

  updateDb: async (userId, bookId, dataSources) => {
    // update bookLoan.returnedAt
    const borrowedBooks = await dataSources.userAPI.getBorrowedBooks({
      id: userId,
    });
    log({ borrowedBooks });
    let bookLoanId;
    borrowedBooks.forEach((elem) => {
      if (elem.book.id == bookId) bookLoanId = elem.id;
    });

    const nuBookLoan = await dataSources.bookLoanAPI.updateBookLoan(bookLoanId);
    log({ nuBookLoan });

    // update user.lentBooks
    await dataSources.userAPI.deleteUserLentBook(
      nuBookLoan.fromUser,
      nuBookLoan.id
    );

    // update user.borrowedBooks
    await dataSources.userAPI.deleteUserBorrowedBooks(
      nuBookLoan.toUser,
      nuBookLoan.id
    );

    return nuBookLoan;
  },
};

module.exports = returnBook;
