const { hashPassword } = require("../../lib/bcrypt");
let Joi = require("joi");
const { OTP_TYPE } = require("../../lib/variable.constant");

module.exports =
  ({ userRepository, JoiError: errorID }) =>
  async (req) => {
    const { body } = req;
    const {
      name,
      id_periode,
      nik,
      email,
      role,
      password,
      phone,
      id_kabupaten,
      id_kecamatan,
      pekerjaan,
      target_desa,
      gender,
      place_birth,
      date_birth,
      address,
    } = body;

    const lookupEmail = async (email) => {
      const user = await userRepository.lookupEmail(email);
      if (user) {
        throw new Joi.ValidationError("Email Sudah Digunakan.");
      }
    };

    // const lookupPhone = async (phone_number) => {
    //   const user = await userMongo.lookupPhone(phone_number);
    //   if (user) {
    //     throw new Joi.ValidationError("Nomor HP Sudah Digunakan.");
    //   }
    // };

    const validate = Joi.object().keys({
      name: Joi.string().required().messages({
        "string.base": `name must string`,
        "string.empty": `name cannot empty`,
        "any.required": `name required`,
      }),
      nik: Joi.string().required(),
      id_periode: Joi.string().required(),
      email: Joi.string().email().required().messages({
        "string.base": `email must string`,
        "string.empty": `email cannot empty`,
        "string.email": `wrong email format`,
        "any.required": `email required`,
      }),
      role: Joi.string()
        .valid("ketua_tim", "koordinator", "relawan")
        .required(),
      phone: Joi.when("role", [
        {
          is: "relawan",
          then: Joi.string().required(),
          otherwise: Joi.forbidden(),
        },
      ]),
      id_kabupaten: Joi.string(),
      id_kecamatan: Joi.string(),
      pekerjaan: Joi.when("role", [
        {
          is: "relawan",
          then: Joi.string().required(),
          otherwise: Joi.forbidden(),
        },
      ]),
      target_desa: Joi.when("role", [
        {
          is: "relawan",
          then: Joi.string().required(),
          otherwise: Joi.forbidden(),
        },
      ]),
      password: Joi.string().required(),
      gender: Joi.string().required().valid("L", "P").label("Jenis Kelamin"),
      place_birth: Joi.string().required().label("Tempat Lahir"),
      date_birth: Joi.date().required().label("Tanggal Lahir"),
      address: Joi.string().required().label("Alamat"),
    });

    let { error } = await validate.validateAsync(body, errorID);
    if (error) throw new Joi.ValidationError(error);

    const hash = await hashPassword(password);
    const user = {
      name,
      id_periode,
      nik,
      email,
      role,
      phone,
      id_kabupaten,
      id_kecamatan,
      pekerjaan,
      target_desa,
      password: hash,
      gender,
      place_birth,
      date_birth,
      address,
    };

    return userRepository.register(user);
  };
