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
const BookAPI = require("./data/sourceBook");
const Books = require("./database/models/book");

// BookLoan Files
const BookLoanAPI = require("./data/sourceBookLoan");
const BookLoans = require("./database/models/bookLoan");

/**
 * * DataSource With MongoDb Model for Resolvers
 */
const dataSources = () => ({
  userAPI: new UserAPI({ Users }),
  bookAPI: new BookAPI({ Books }),
  bookLoanAPI: new BookLoanAPI({ BookLoans }),
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  uploads: false, // Bug From Apollo Server, Must pass false value
  formatError(err) {
    if (!err.originalError) {
      return err;
    }
    const data = err.originalError.data;
    const message = err.message || "An error occurred";
    return { data: data, message: message };
  },
});

/**
 * I don't know what will I use in the Test Suite
 * But I know Im going to use a lot of things
 * Pass as much as possible for later
 */
module.exports = {
  server,
  typeDefs,
  resolvers,
};
