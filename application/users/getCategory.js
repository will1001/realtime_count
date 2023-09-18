const Joi = require("joi");

module.exports =
  ({ userRepository, JoiError: errorID }) =>
  async (req) => {
    const { query } = req;

    const validate = Joi.object().keys({
      id: Joi.string(),
    });

    let { error } = await validate.validateAsync(query, errorID);
    if (error) throw new Joi.ValidationError(error);
    return userRepository.getCategory(req);
  };
