const Joi = require("joi");
const { hasEmail } = require("../../lib/validate");
const bcrypt = require("bcrypt");

module.exports =
  ({ userRepository, userMongo, JoiError: errorID }) =>
  async (req) => {
    const { body } = req;
    const { username, password } = body;
    const validate = Joi.object().keys({
      username: Joi.string().required().messages({
        "string.base": `username must string`,
        "string.empty": `username cannot empty`,
        "any.required": `username required`,
      }),
      password: Joi.string().required().messages({
        "string.base": `password must string`,
        "string.empty": `password cannot empty`,
        "any.required": `password required`,
      }),
    });

    let { error } = await validate.validateAsync(
      { username, password },
      errorID
    );
    if (error) throw new Joi.ValidationError(error);

    if (hasEmail(username)) {
      const findUser = await userMongo.findByEmail(username);
      if (!findUser) throw new Joi.ValidationError("Email not registered!");

      if (!(await bcrypt.compare(password, findUser.password))) {
        throw new Joi.ValidationError("Password Incorrect");
      }

      if (!findUser.api_gateway_key || !findUser.api_gateway_secret) {
        const response = {
          name: findUser.nama,
          phone: findUser.phone,
          email: findUser.email,
        };
        throw new Joi.ValidationError("Old User", null, response);
      }

      return userRepository.login(findUser);
    } else {
      const findUser = await userMongo.findByPhone(username);
      if (!findUser)
        throw new Joi.ValidationError("Phone number not registered!");
      if (!(await bcrypt.compare(password, findUser.password))) {
        throw new Joi.ValidationError("Password Incorrect");
      }

      if (!findUser.api_gateway_key || !findUser.api_gateway_secret) {
        const response = {
          name: findUser.nama,
          phone: findUser.phone,
          email: findUser.email,
        };
        throw new Joi.ValidationError("Old User", null, response);
      }

      return userRepository.login(findUser);
    }
  };
