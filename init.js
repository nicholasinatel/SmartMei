const log = require("debug")("apollo:init");
const logError = log.extend("error");

const startDB = require("./src/database/mongodb");
const { server } = require("./src/server");

async function Main() {
  await startDB();

  server.listen({ port: 8080 }).then(({ url }) => {
    log(`Server ready at ${url}`);
  });
}

Main();
