const log = require("debug")("apollo:server");
const logError = log.extend("error");

const { ApolloServer } = require("apollo-server");
/**
 * Using the design approach
 * proposed by the official
 * Apollo Server documentation
 */
const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");

/**
 * * Connect the dataSources of Users
 * with
 * * DB model for Users
 * This Class and Instantiated Object Will be used
 * as the communication between GraphQl and Mongoose
 */
const UserAPI = require("./data/sourceUser");
const Users = require("./database/models/user");

// Book Files
// BookLoan Files

/**
 * * DataSource With MongoDb Model for Resolvers
 */
const dataSources = () => ({
  userAPI: new UserAPI({ Users }),
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  uploads: false,
});

/**
 * I don't know what will I use in the Test Suite
 * But I know Im going to use a lot of things
 * Pass as much as possible for later
 */
module.exports = {
  server,
  dataSources,
  typeDefs,
  resolvers,
  UserAPI,
  Users,
};
