const { asValue } = require("awilix");
const connectMongoDB = require("../databases/mongo");
const errorID = require("../databases/validator/JoiErrorID");

module.exports = {
  mongo(container) {
    const mongo = connectMongoDB();

    container.register({
      database: asValue(mongo),
      JoiError: asValue(errorID),
    });

    container.loadModules([
      "infrastructure/databases/schemas/*.js",
      "infrastructure/repositories/*.js",
      "infrastructure/datasource/**/*.js",
    ]);
  },
};
