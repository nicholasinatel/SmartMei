const log = require("debug")("apollo:graphql:controller:addBook");
const logError = log.extend("error");

const addBook = {
  init: async (args, dataSources) => {
    const userId = args.loggedUserId;
    const bookUser = await dataSources.userAPI.collectionBooks(userId);
    const bookCollection = bookUser.collectionBooks;
    const bookTitleToAdd = args.input.title;
    const bookToAdd = args.input;

    const bookExist = await addBook.checkBook(bookCollection, bookTitleToAdd);

    return await addBook.resolve(bookExist, userId, bookToAdd, dataSources);
  },

  resolve: async (bookExist, userId, bookToAdd, dataSources) => {
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
      // console.log(bookExist);
      // error.data = { id: bookExist._id };
      throw error;
    }
  },

  checkBook: async (bookCollection, bookTitle) => {
    let bookExist = false;
    bookCollection.forEach((elem) => {
      if (elem.title == bookTitle) {
        bookExist = true;
      } else {
        bookExist = false;
      }
    });
    return bookExist;
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
