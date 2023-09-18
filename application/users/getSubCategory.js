const Joi = require("joi");

module.exports =
  ({ userRepository, JoiError: errorID }) =>
  async (req) => {
    const { params } = req;

    const validate = Joi.object().keys({
      id_category: Joi.string(),
    });

    let { error } = await validate.validateAsync(params, errorID);
    if (error) throw new Joi.ValidationError(error);
    return userRepository.getSubCategory(req);
  };
