const validator = require("validator");

const log = require("debug")("apollo:graphql:resolvers");
const logError = log.extend("error");

module.exports = {
  Query: {
    /**
     * * user
     * @param {id}: userId sent throw query
     * @param {dataSources}: Created and passed at Server, holds all methods and information in context by the MongoDb
     */
    user: async (_, { id }, { dataSources }) => {
      log("Query User by iD: %O", id);
      const user = await dataSources.userAPI.findUser({ id: id });
      return user;
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
        log({ user });
        return user;
      }
    },
  },
};
