const log = require("debug")("apollo:graphql:controller:addBook");
const logError = log.extend("error");

const addBook = {
  init: async (args, dataSources) => {
    const userId = args.loggedUserId;
    const bookUser = await dataSources.userAPI.collectionBooks(userId);
    const bookCollection = bookUser.collectionBooks;
    const bookTitleToAdd = args.input.title;
    const bookToAdd = args.input;

    const { bookExist, existBookId } = await addBook.checkBook(
      bookCollection,
      bookTitleToAdd
    );

    return await addBook.resolve(
      bookExist,
      userId,
      bookToAdd,
      dataSources,
      existBookId
    );
  },

  resolve: async (bookExist, userId, bookToAdd, dataSources, existBookId) => {
    logError({ bookExist, existBookId });
    if (!bookExist) {
      const book = await dataSources.bookAPI.addBook(userId, bookToAdd);
      // Update User Collection of Books
      if (book) {
        await dataSources.userAPI.updateUserBookCollection(userId, book);
      }
      return book;
    } else {
      logError("Book Already Exists: %O", bookToAdd);
      const error = new Error("Book already exists!");
      logError({ existBookId });
      error.data = { id: existBookId };
      throw error;
    }
  },

  checkBook: async (bookCollection, bookTitle) => {
    let bookExist = false;
    let existBookId;
    await bookCollection.forEach((elem) => {
      if (elem.title.toString() === bookTitle.toString()) {
        bookExist = true;
        existBookId = elem._id;
      }
    });
    const result = {
      bookExist: bookExist,
      existBookId: existBookId,
    };
    return result;
  },

  //   existingBook: async (bookCollection, bookTitleToAdd) => {
  //     let book = bookCollection.filter((obj) => {
  //       return obj.title == bookTitleToAdd;
  //     });
  //     book = book[0].toObject();
  //     book.id = book._id;
  //     delete book._id;
  //     delete book.__v;
  //     return book;
  //   },
};

module.exports = addBook;
