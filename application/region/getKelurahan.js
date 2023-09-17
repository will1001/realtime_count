const Joi = require("joi");

module.exports =
  ({ regionRepository, JoiError: errorID }) =>
  async (req) => {
    const { params } = req;

    const validate = Joi.object().keys({
      id_kecamatan: Joi.string().required(),
    });

    let { error } = await validate.validateAsync(params, errorID);
    if (error) throw new Joi.ValidationError(error);
    return regionRepository.getKelurahan(params.id_kecamatan);
  };
