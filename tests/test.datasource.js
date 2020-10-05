const log = require("debug")("apollo:test:datasource");
const logError = log.extend("error");

const assert = require("assert");
const fetch = require("node-fetch");

const startDB = require("../src/database/mongodb");

const { createUser } = require("./mock/mutation");

const { server, typeDefs, resolvers } = require("../src/server");
const { url } = require("inspector");

const dataSources = () => ({
  userAPI: new UserAPI({ Users }),
});

const URL = "http://localhost:8080/";

const options = {
  method: "POST",
  headers: {
    "Accept-Encoding": "gzip, deflate, br",
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Connection": "keep-alive",
    'DNT': '1',
    'Origin': 'http://localhost:8080'
  },
  body: JSON.stringify({
    query: createUser,
  }),
};

describe("API Tests", function () {
  let dbConnection;

  this.beforeAll(async () => {
    dbConnection = await startDB();
    server.listen({ port: 8080 }).then(({ url }) => {
      log(`Server ready at ${url}`);
    });
  });

  describe("UserAPI DataSource", async () => {
    it("Mutation: createUser(input: CreateUserInput!): User!", async () => {
      await fetch(URL, options)
        .then((res) => res.json())
        .then((json) => {
          const error = json.errors;
          const response = json.data.createUser;

          if(error){
            assert.equal(error.message, 'User already exists')
          }
          if(response) {
            assert.equal(response.name, 'yoda');
          }
        });
    });
  });

  //   describe("UserAPI DataSource", function () {
  //     it("Query: user(id: ID)", async () => {});
  //   });

  this.afterAll(async () => {
    dbConnection.close();
    server.stop();
  });
});
