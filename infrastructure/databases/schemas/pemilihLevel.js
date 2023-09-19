const { RESOLVER } = require("awilix");
const { Schema } = require("mongoose");

const pemilihLevelSchema = new Schema(
  {
    _id: { type: String, required: true },
    id_pemilih: { type: String, optional: true },
    id_dpr_level: { type: Number, optional: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const pemilihLevelModel = ({ database: mongoose }) =>
  mongoose.model("pemilih_levels", pemilihLevelSchema);
module.exports = pemilihLevelModel;

pemilihLevelModel[RESOLVER] = {
  name: "pemilihLevelSchema",
};
