const Joi = require("joi");

module.exports =
  ({ regionRepository }) =>
  async (req) => {
    return regionRepository.getKabupaten(req);
  };
