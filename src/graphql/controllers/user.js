const log = require("debug")("apollo:graphql:controller:user");
const logError = log.extend("error");

const userControl = {
  checkLoggedUser: async (userId, dataSources) => {
    return await dataSources.userAPI.checkUser(userId);
  },
};

module.exports = userControl;
