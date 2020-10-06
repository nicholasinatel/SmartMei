const log = require("debug")("apollo:test:datasource");
const logUser = log.extend("user");
const logBook = log.extend("book");
const logLoan = log.extend("loan");
const logQuery = log.extend("query");
const logError = log.extend("error");

const assert = require("assert");
const fetch = require("node-fetch");

const startDB = require("../src/database/mongodb");

const mock = require("./mock/mutation");
const queryMock = require("./mock/queryAPI");

const { server, typeDefs, resolvers } = require("../src/server");
const { url } = require("inspector");

const dataSources = () => ({
  userAPI: new UserAPI({ Users }),
});

const URL = "http://localhost:8080/";
const defaultOptions = require("./mock/options");

let user1Id, user2Id;
let book1, book2, book3, book4;
let bookLoan1;
let returnBook;

describe("API Tests", function () {
  this.timeout(35000);
  let dbConnection;

  this.beforeAll(async function () {
    dbConnection = await startDB();
    server.listen({ port: 8080 }).then(({ url }) => {
      log(`Server ready at ${url}`);
    });
  });

  describe("User Creation: ", function () {
    /**
     * This test suite must assert true
     * for user being created
     * or for user already created
     */
    const { createUser1, createUser2 } = mock(null, null, null, null);
    it("User 1", async function () {
      defaultOptions.body = {};
      defaultOptions.body.query = createUser1;
      defaultOptions.body = JSON.stringify(defaultOptions.body);

      const response = await fetch(URL, defaultOptions);
      const json = await response.json();
      if (json.errors) {
        logError(json.errors[0]);
        user1Id = json.errors[0].data.id;
        assert.equal(json.errors[0].message, "User already exists");
      }
      if (json.data) {
        logUser(json.data);
        user1Id = json.data.createUser.id;
        assert.equal(json.data.createUser.name, "yoda");
      }
    });

    it("User 2", async function () {
      defaultOptions.body = {};
      defaultOptions.body.query = createUser2;
      defaultOptions.body = JSON.stringify(defaultOptions.body);

      const response = await fetch(URL, defaultOptions);
      const json = await response.json();
      if (json.errors) {
        logError(json.errors[0]);
        user2Id = json.errors[0].data.id;
        assert.equal(json.errors[0].message, "User already exists");
      }
      if (json.data) {
        logUser(json.data);
        user2Id = json.data.createUser.id;
        assert.equal(json.data.createUser.name, "Darth Sidious");
      }
    });
  });

  describe("Add Book To My Collection ", function () {
    it("Book 1", async function () {
      const { addBook1ToMyCollection } = mock(user1Id, null, null, null);

      defaultOptions.body = {};
      defaultOptions.body.query = addBook1ToMyCollection;
      defaultOptions.body = JSON.stringify(defaultOptions.body);

      const response = await fetch(URL, defaultOptions);
      const json = await response.json();
      if (json.errors) {
        logError(json.errors[0]);
        book1 = json.errors[0].data.id;
        assert.equal(json.errors[0].message, "Book already exists!");
      }
      if (json.data) {
        logBook(json.data);
        book1 = json.data.addBookToMyCollection.id;
        assert.equal(
          json.data.addBookToMyCollection.title,
          "1001 Discos para Ouvir"
        );
      }
    });

    it("Book 2", async function () {
      const { addBook2ToMyCollection } = mock(user1Id, null, null, null);

      defaultOptions.body = {};
      defaultOptions.body.query = addBook2ToMyCollection;
      defaultOptions.body = JSON.stringify(defaultOptions.body);

      const response = await fetch(URL, defaultOptions);
      const json = await response.json();
      if (json.errors) {
        logError(json.errors[0]);
        book2 = json.errors[0].data.id;
        assert.equal(json.errors[0].message, "Book already exists!");
      }
      if (json.data) {
        logBook(json.data);
        book2 = json.data.addBookToMyCollection.id;
        assert.equal(
          json.data.addBookToMyCollection.title,
          "Lord Of The Rings"
        );
      }
    });

    it("Book 3", async function () {
      const { addBook3ToMyCollection } = mock(user1Id, null, null, null);

      defaultOptions.body = {};
      defaultOptions.body.query = addBook3ToMyCollection;
      defaultOptions.body = JSON.stringify(defaultOptions.body);

      const response = await fetch(URL, defaultOptions);
      const json = await response.json();
      if (json.errors) {
        logError(json.errors[0]);
        book3 = json.errors[0].data.id;
        assert.equal(json.errors[0].message, "Book already exists!");
      }
      if (json.data) {
        logBook(json.data);
        book3 = json.data.addBookToMyCollection.id;
        assert.equal(json.data.addBookToMyCollection.title, "Unfuck Yourself");
      }
    });

    it("Book 4", async function () {
      const { addBook4ToMyCollection } = mock(null, user2Id, null, null);

      defaultOptions.body = {};
      defaultOptions.body.query = addBook4ToMyCollection;
      defaultOptions.body = JSON.stringify(defaultOptions.body);

      const response = await fetch(URL, defaultOptions);
      const json = await response.json();
      if (json.errors) {
        logError(json.errors[0]);
        book4 = json.errors[0].data.id;
        assert.equal(json.errors[0].message, "Book already exists!");
      }
      if (json.data) {
        logBook(json.data);
        book4 = json.data.addBookToMyCollection.id;
        assert.equal(
          json.data.addBookToMyCollection.title,
          "As 5 Linguagens do Amor"
        );
      }
    });
  });

  describe("Lend a Book", function () {
    it("Book 1 Loan", async function () {
      const { lendBook1 } = mock(user1Id, user2Id, book1, null);

      defaultOptions.body = {};
      defaultOptions.body.query = lendBook1;
      defaultOptions.body = JSON.stringify(defaultOptions.body);

      const response = await fetch(URL, defaultOptions);
      const json = await response.json();

      logLoan({
        fromUser: `yoda ${user1Id}`,
        toUser: `Darth Sidious ${user2Id}`,
        json: json,
      });
      if (json.errors) {
        logError(json.errors[0]);
        // book4 = json.errors[0].data.id;
        assert.equal(json.errors[0].message, "Book already lent");
      }
      if (json.data) {
        // book4 = json.data.lendBook.id;
        assert.equal(json.data.lendBook.book.title, "1001 Discos para Ouvir");
      }
    });

    it("Book 2 Loan", async function () {
      const { lendBook2 } = mock(user1Id, user2Id, book1, book2);

      defaultOptions.body = {};
      defaultOptions.body.query = lendBook2;
      defaultOptions.body = JSON.stringify(defaultOptions.body);

      const response = await fetch(URL, defaultOptions);
      const json = await response.json();

      logLoan({
        fromUser: `yoda ${user1Id}`,
        toUser: `Darth Sidious ${user2Id}`,
        json: json,
      });

      if (json.errors) {
        logError(json.errors[0]);
        // book4 = json.errors[0].data.id;
        assert.equal(json.errors[0].message, "Book already lent");
      }
      if (json.data) {
        // book4 = json.data.lendBook.id;
        assert.equal(json.data.lendBook.book.title, "Lord Of The Rings");
      }
    });
  });

  describe("Return a Book", function () {
    it("Return Book 2", async function () {
      const { returnBook2 } = mock(null, user2Id, null, book2);

      defaultOptions.body = {};
      defaultOptions.body.query = returnBook2;
      defaultOptions.body = JSON.stringify(defaultOptions.body);

      const response = await fetch(URL, defaultOptions);
      const json = await response.json();

      logLoan({
        fromUser: `Darth Sidious ${user2Id}`,
        toUser: `yoda ${user1Id}`,
        json: json,
      });

      if (json.errors) {
        logError(json.errors[0]);
        // book4 = json.errors[0].data.id;
        assert.equal(json.errors[0].message, "User did not borrow this book");
      }
      if (json.data) {
        logLoan("Return Book 2: %O", json.data);
        // book4 = json.data.lendBook.id;
        assert.equal(json.data.returnBook.book.title, "Lord Of The Rings");
      }
    });
  });

  describe("Query for Full Details about users", function () {
    it("Query User 1 Test", async function () {
      const { user1 } = await queryMock(user1Id, null);
      defaultOptions.body = {};
      defaultOptions.body.query = user1;
      defaultOptions.body = JSON.stringify(defaultOptions.body);

      const response = await fetch(URL, defaultOptions);
      const json = await response.json();

      logQuery("Query User 1: %O", json.data);

      assert.equal(json.data.user.id, user1Id);
    });

    it("Query User 2 Test", async function () {
      const { user2 } = await queryMock(null, user2Id);
      defaultOptions.body = {};
      defaultOptions.body.query = user2;
      defaultOptions.body = JSON.stringify(defaultOptions.body);

      const response = await fetch(URL, defaultOptions);
      const json = await response.json();

      logQuery("Query User 2: %O", json.data);

      assert.equal(json.data.user.id, user2Id);
    });
  });

  this.afterAll(async function () {
    dbConnection.close();
    server.stop();
  });
});
