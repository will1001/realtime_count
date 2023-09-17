const { hashPassword } = require("../../lib/bcrypt");
let Joi = require("joi");
const { OTP_TYPE } = require("../../lib/variable.constant");

module.exports =
  ({ userRepository, JoiError: errorID }) =>
  async (req) => {
    const { body } = req;
    const { name, email, role, password, id_kabupaten } = body;

    const lookupEmail = async (email) => {
      const user = await userRepository.lookupEmail(email);
      if (user) {
        throw new Joi.ValidationError("Email Sudah Digunakan.");
      }
    };

    const validate = Joi.object().keys({
      name: Joi.string().required().messages({
        "string.base": `name must string`,
        "string.empty": `name cannot empty`,
        "any.required": `name required`,
      }),
      email: Joi.string().email().required().messages({
        "string.base": `email must string`,
        "string.empty": `email cannot empty`,
        "string.email": `wrong email format`,
        "any.required": `email required`,
      }),
      role: Joi.string().valid("admin").required(),
      id_kabupaten: Joi.string(),
      password: Joi.string().required(),
    });

    let { error } = await validate.validateAsync(body, errorID);
    if (error) throw new Joi.ValidationError(error);

    const hash = await hashPassword(password);
    const user = {
      name,
      email,
      role,
      id_kabupaten,
      password: hash,
    };

    return userRepository.register(user);
  };
