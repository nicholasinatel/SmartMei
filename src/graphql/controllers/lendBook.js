const log = require("debug")("apollo:graphql:controller:lendBook");
const logError = log.extend("error");

const lendBook = {
  init: async (args, dataSources) => {
    log("lendBook:");
    const fromUserId = args.loggedUserId;
    const toUserId = args.input.toUserId;
    const bookId = args.input.bookId;
    log({ fromUserId, toUserId, bookId });

    // check if user has the book to lend
    const ok = await lendBook.ownTheBook(fromUserId, bookId, dataSources);
    if (ok) {
      return lendBook.updateDb(fromUserId, toUserId, bookId, dataSources);
    }
  },

  ownTheBook: async (userId, bookId, dataSources) => {
    const books = await dataSources.userAPI.collectionBooks(userId);

    let owner = false;
    let lentAlready = false;

    books.collectionBooks.forEach((elem) => {
      if (elem._id == bookId) owner = true;
    });
    if (owner) {
      // Check if user already lent the book
      const lentBooks = await dataSources.userAPI.getLentBooks({ id: userId });
      lentBooks.forEach((elem) => {
        if (elem.book.id == bookId) lentAlready = true;
      });
    }
    return lendBook.resolve(owner, lentAlready);
  },

  resolve: async (owner, lentAlready) => {
    log({ owner, lentAlready });
    if (owner) {
      if (!lentAlready) {
        return true;
      } else if (lentAlready) {
        const error = new Error("Book already lent");
        throw error;
      }
    } else {
      const error = new Error("User does not have this book");
      throw error;
    }
  },

  updateDb: async (fromUserId, toUserId, bookId, dataSources) => {
    const savedBookLoan = await dataSources.bookLoanAPI.createBookLoan(
      fromUserId,
      toUserId,
      bookId
    );

    // update lentBooks
    await dataSources.userAPI.updateUserLentBooks(fromUserId, savedBookLoan.id);
    // update borrowedBooks
    await dataSources.userAPI.updateUserBorrowedBooks(
      toUserId,
      savedBookLoan.id
    );

    return savedBookLoan;
  },
};

module.exports = lendBook;
