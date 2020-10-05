const log = require("debug")("apollo:datasources:book");
const logError = log.extend("error");

const { DataSource } = require("apollo-datasource");

class BookAPI extends DataSource {
  constructor({ Books }) {
    super();
    this.Books = Books;
  }

  initialize(config) {
    this.context = config.context;
    this.BookModel = this.Books.model("book");
  }

  async addBook(id, input) {
    const bookTitle = input.title.toString();
    const bookPages = input.pages;

    const newBook = new this.BookModel({
      title: bookTitle,
      pages: bookPages,
    });

    const createdBook = await newBook.save();

    log({ createdBook });

    return createdBook;
  }
}

module.exports = BookAPI;
