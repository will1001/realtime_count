const Joi = require("joi");
const { RESOLVER } = require("awilix");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

const { USER_STATUS } = require("../../../lib/variable.constant");

const regionMongo = ({
  kabupatenSchema,
  kecamatanSchema,
  kelurahanSchema,
}) => ({
  getKabupaten: async (req) => {
    const { query } = req;
    let filters = {};
    if (query.id) {
      filters._id = {
        $in: [query.id],
      };
    }
    try {
      const data = await kabupatenSchema.find(filters);

      return { data };
    } catch (err) {
      throw err;
    }
  },
  getKecamatan: async (id_kabupaten) => {
    try {
      const data = await kecamatanSchema.find({ id_kabupaten });

      return { data };
    } catch (err) {
      throw err;
    }
  },
  getKelurahan: async (id_kecamatan) => {
    try {
      const data = await kelurahanSchema.find({ id_kecamatan });

      return { data };
    } catch (err) {
      throw err;
    }
  },
  getKelurahans: async () => {
    try {
      const data = await kelurahanSchema.find();

      return { data };
    } catch (err) {
      throw err;
    }
  },
});

module.exports = regionMongo;
regionMongo[RESOLVER] = {
  name: "regionMongo",
};
