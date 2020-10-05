const validator = require("validator");
const ObjectId = require("mongoose").Types.ObjectId;

const log = require("debug")("apollo:graphql:resolvers");
const logError = log.extend("error");

const userControl = require("./controllers/user");
const addBookControl = require("./controllers/addBookToMyCollection");
const lendBookControl = require("./controllers/lendBook");
const returnBookControl = require("./controllers/returnBook");

module.exports = {
  Query: {
    user: async (_, { id }, { dataSources }) => {
      log("Query User, id: %O", id);

      if (!validator.isMongoId(id)) {
        const error = new Error("Invalid Object Id");
        throw error;
      } else {
        const validateId = new ObjectId(id);
        const user = await dataSources.userAPI.findUser({ id: id });
        return user;
      }
    },
  },

  Mutation: {
    createUser: async (_, { input }, { dataSources }) => {
      log("Mutation CreateUser, input: %O", input);

      if (!validator.isEmail(input.email)) {
        const error = new Error("Invalid E-mail");
        throw error;
      } else if (validator.isEmpty(input.name)) {
        const error = new Error("Invalid Username");
        throw error;
      } else {
        const user = await dataSources.userAPI.createUser(input);
        return user;
      }
    },

    addBookToMyCollection: async (_, args, { dataSources }) => {
      log("Mutation addBookToMyCollection, input: %O", args);

      if (!validator.isMongoId(args.loggedUserId)) {
        const error = new Error("LoggedUser Invalid ObjectId");
        throw error;
      }
      if (validator.isEmpty(args.input.title)) {
        const error = new Error("Invalid Book Title");
        throw error;
      }
      if (args.input.pages == 0 || args.input.pages < 0) {
        const error = new Error("Number of Pages Required");
        throw error;
      }

      const loggedUser = await userControl.checkLoggedUser(
        args.loggedUserId,
        dataSources
      );
      if (loggedUser) {
        return await addBookControl.init(args, dataSources);
      } else {
        const error = new Error("User does not exist");
        throw error;
      }
    },

    lendBook: async (_, args, { dataSources }) => {
      log("Mutation lendBook, input: %O", args);

      if (!validator.isMongoId(args.loggedUserId)) {
        const error = new Error("LoggedUser Invalid ObjectId");
        throw error;
      }
      if (!validator.isMongoId(args.input.bookId)) {
        const error = new Error("Book Invalid ObjectId");
        throw error;
      }
      if (!validator.isMongoId(args.input.toUserId)) {
        const error = new Error("toUser Invalid ObjectId");
        throw error;
      }

      const loggedUser = await userControl.checkLoggedUser(
        args.loggedUserId,
        dataSources
      );
      if (loggedUser) {
        const result = await lendBookControl.init(args, dataSources);
        log({ result });
        return result;
      } else {
        const error = new Error("User does not exist");
        throw error;
      }
    },

    returnBook: async (_, args, { dataSources }) => {
      log("Mutation returnBook, input: %O", args);

      if (!validator.isMongoId(args.loggedUserId)) {
        const error = new Error("User Invalid ObjectId");
        throw error;
      }
      if (!validator.isMongoId(args.bookId)) {
        const error = new Error("Book Invalid ObjectId");
        throw error;
      }

      const loggedUser = await userControl.checkLoggedUser(
        args.loggedUserId,
        dataSources
      );
      if (loggedUser) {
        const result = await returnBookControl.init(args, dataSources);
        log({ result });
        return result;
      } else {
        const error = new Error("User does not exist");
        throw error;
      }
    },
  },
};
