const { RESOLVER } = require("awilix");

const regionRepository = ({ regionMongo }) => ({
  getKabupaten: async (req) => {
    return await regionMongo.getKabupaten(req);
  },
  getKecamatan: async (id_kabupaten) => {
    return await regionMongo.getKecamatan(id_kabupaten);
  },
  getKelurahan: async (id_kecamatan) => {
    return await regionMongo.getKelurahan(id_kecamatan);
  },
  getKelurahans: async () => {
    return await regionMongo.getKelurahans();
  },
});

module.exports = regionRepository;
regionRepository[RESOLVER] = {
  name: "regionRepository",
};
