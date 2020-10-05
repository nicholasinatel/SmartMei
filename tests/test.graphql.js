const EasyGraphQLTester = require("easygraphql-tester");

const log = require("debug")("apollo:test:graphql");
const logError = log.extend("error");

const assert = require("assert");

const startDB = require("../src/database/mongodb");
const { validQuery, wrongQuery } = require("./mock/query");

const {
  server,
  dataSources,
  typeDefs,
  resolvers,
  UserAPI,
  Users,
} = require("../src/server");

describe("GraphQL Test", function () {
  let dbConnection;
  let tester;
  this.beforeAll(async () => {
    log("For Testing if Schema and Resolvers Are Ok");
    dbConnection = await startDB();
    const connection = await dbConnection.readyState;
    // Start Server here.
    server.listen().then(({ url }) => {
      log(`Server ready at ${url}`);
    });

    // Easy GraphQL Tester
    tester = new EasyGraphQLTester(typeDefs, resolvers);

    assert.equal(connection, 1);
  });

  describe("User Query", function () {
    it("Valid Query", async () => {
      await tester.test(true, validQuery);
    });
    it("Wrong Query", async () => {
      await tester.test(false, wrongQuery);
    });
  });

  this.afterAll(() => {
    describe("Disconnect Services", () => {
      it("Mongodb Disconnect", async () => {
        // Disconnect DB
        await dbConnection.close();
        /**
         * 0: disconnected
         * 1: connected
         * 2: connecting
         * 3: disconnecting
         */
        const connection = await dbConnection.readyState;
        await server.stop();

        assert.equal(connection, 0);
      });
    });
  });
});
