const Joi = require("joi");

module.exports =
  ({ userMongo, JoiError: errorID }) =>
  async (req) => {
    return userMongo.getTarget(req);
  };
