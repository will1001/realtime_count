const { RESOLVER } = require("awilix");
const { Schema } = require("mongoose");

const kecamatanSchema = new Schema(
  {
    _id: { type: String, required: true },
    id_kabupaten: { type: String, required: true },
    name: { type: String, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const kecamatanModel = ({ database: mongoose }) =>
  mongoose.model("kecamatans", kecamatanSchema);
module.exports = kecamatanModel;

kecamatanModel[RESOLVER] = {
  name: "kecamatanSchema",
};
