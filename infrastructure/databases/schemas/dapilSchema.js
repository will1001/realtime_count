const { RESOLVER } = require("awilix");
const { Schema } = require("mongoose");

const dapilSchema = new Schema(
  {
    _id: { type: Number, required: true },
    name: { type: String, required: true },
    id_kabupaten: { type: Number, optional: true },
    jml_kecamatan: { type: Number, optional: true },
    jml_kelurahan: { type: Number, optional: true },
    jml_tps: { type: Number, optional: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const dapilModel = ({ database: mongoose }) =>
  mongoose.model("dapils", dapilSchema);
module.exports = dapilModel;

dapilModel[RESOLVER] = {
  name: "dapilSchema",
};
