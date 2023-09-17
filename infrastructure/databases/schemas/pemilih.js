const { RESOLVER } = require("awilix");
const { Schema } = require("mongoose");

const pemilihSchema = new Schema(
  {
    _id: { type: String, required: true },
    nama: { type: String, optional: true },
    nik: { type: String, required: true, unique: true },
    gender: { type: String, optional: true },
    alamat: { type: String, optional: true },
    tps: { type: String, optional: true },
    id_kabupaten: { type: Number, optional: true },
    id_kecamatan: { type: Number, optional: true },
    id_kelurahan: { type: Number, optional: true },
    id_category: { type: Number, optional: true },
    id_sub_category: { type: Number, optional: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const pemilihModel = ({ database: mongoose }) =>
  mongoose.model("pemilihs", pemilihSchema);
module.exports = pemilihModel;

pemilihModel[RESOLVER] = {
  name: "pemilihSchema",
};
