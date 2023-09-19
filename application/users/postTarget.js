const Joi = require("joi");

module.exports =
  ({ userMongo, JoiError: errorID }) =>
  async (req) => {
    const { body } = req;

    const validate = Joi.object().keys({
      id_dapil: Joi.number(),
      anggota: Joi.number(),
      dpc: Joi.number(),
      dpra: Joi.number(),
      bpkk: Joi.number(),
      tn: Joi.number(),
      kepemudaan: Joi.number(),
      bko: Joi.number(),
      bpu: Joi.number(),
    });

    let { error } = await validate.validateAsync(body, errorID);
    if (error) throw new Joi.ValidationError(error);
    userMongo.postTarget(req);
    return {};
  };
