const mongoose = require("mongoose");

async function startDatabase() {
  const mongoURL =
    "mongodb+srv://dev:smartmei123456@cluster0.xcute.mongodb.net/smartMei?retryWrites=true&w=majority";

  await mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useFindAndModify: false,
  });

  return mongoose.connection;
}

module.exports = startDatabase;
