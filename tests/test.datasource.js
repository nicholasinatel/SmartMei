const log = require("debug")("apollo:test:datasource");
const logError = log.extend("error");

const assert = require("assert");
const fetch = require("node-fetch");

const startDB = require("../src/database/mongodb");

const mock = require("./mock/mutation");

const { server, typeDefs, resolvers } = require("../src/server");
const { url } = require("inspector");

const dataSources = () => ({
  userAPI: new UserAPI({ Users }),
});

const URL = "http://localhost:8080/";
const defaultOptions = require("./mock/options");

let user1Id, user2Id;
let book1, book2, book3, book4;
let bookLoan1, bookLoan2;
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
    const { createUser1, createUser2 } = mock(null, null);
    it("User 1", async function () {
      defaultOptions.body = {};
      defaultOptions.body.query = createUser1;
      defaultOptions.body = JSON.stringify(defaultOptions.body);

      const response = await fetch(URL, defaultOptions);
      const json = await response.json();
      if (json.errors) {
        user1Id = json.errors[0].data.id;
        assert(json.errors[0].message, "User already exists");
      }
      if (json.data) {
        user1Id = json.data.createUser.id;
        assert(json.data.createUser.name, "yoda");
      }
    });

    it("User 2", async function () {
      defaultOptions.body = {};
      defaultOptions.body.query = createUser2;
      defaultOptions.body = JSON.stringify(defaultOptions.body);

      const response = await fetch(URL, defaultOptions);
      const json = await response.json();
      if (json.errors) {
        user2Id = json.errors[0].data.id;
        assert(json.errors[0].message, "User already exists");
      }
      if (json.data) {
        user2Id = json.data.createUser.id;
        assert(json.data.createUser.name, "yoda");
      }
    });
  });

  describe("Add Book To My Collection ", function () {
    it("Book 1", async function () {
      const { addBook1ToMyCollection } = mock(user1Id, null);

      defaultOptions.body = {};
      defaultOptions.body.query = addBook1ToMyCollection;
      defaultOptions.body = JSON.stringify(defaultOptions.body);

      const response = await fetch(URL, defaultOptions);
      const json = await response.json();
      if (json.errors) {
        book1 = json.errors[0].data.id;
        assert(json.errors[0].message, "Book already exists!");
      }
      if (json.data) {
        book1 = json.data.addBookToMyCollection.id;
        assert(json.data.addBookToMyCollection.title, "1001 Discos para Ouvir");
      }
    });

    it("Book 2", async function () {
      const { addBook2ToMyCollection } = mock(user1Id, null);

      defaultOptions.body = {};
      defaultOptions.body.query = addBook2ToMyCollection;
      defaultOptions.body = JSON.stringify(defaultOptions.body);

      const response = await fetch(URL, defaultOptions);
      const json = await response.json();
      if (json.errors) {
        book2 = json.errors[0].data.id;
        assert(json.errors[0].message, "Book already exists!");
      }
      if (json.data) {
        book2 = json.data.addBookToMyCollection.id;
        assert(json.data.addBookToMyCollection.title, "Lord Of The Rings");
      }
    });

    it("Book 3", async function () {
      const { addBook3ToMyCollection } = mock(user1Id, null);

      defaultOptions.body = {};
      defaultOptions.body.query = addBook3ToMyCollection;
      defaultOptions.body = JSON.stringify(defaultOptions.body);

      const response = await fetch(URL, defaultOptions);
      const json = await response.json();
      if (json.errors) {
        book3 = json.errors[0].data.id;
        assert(json.errors[0].message, "Book already exists!");
      }
      if (json.data) {
        book3 = json.data.addBookToMyCollection.id;
        assert(json.data.addBookToMyCollection.title, "Unfuck Yourself");
      }
    });
  });

  //   describe("UserAPI DataSource", function () {
  //     it("Query: user(id: ID)", async () => {});
  //   });

  this.afterAll(async function () {
    dbConnection.close();
    server.stop();
  });
});
