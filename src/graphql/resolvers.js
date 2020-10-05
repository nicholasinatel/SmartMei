const log = require("debug")("apollo:graphql:resolvers");
const logError = log.extend("error");

module.exports = {
    Query: {
        user: async (_, {id}, {dataSources}) => {
            log("Query User by iD: %O", id);
        }
    }
}