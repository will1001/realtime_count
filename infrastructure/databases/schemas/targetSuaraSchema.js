const { RESOLVER } = require("awilix");
const { Schema } = require("mongoose");

const dprLevelSchema = new Schema(
  {
    _id: { type: Number, required: true },
    target: { type: Number, required: true },
    id_dapil: { type: Number, required: true },
    anggota: { type: Number, optional: true },
    dpc: { type: Number, optional: true },
    dpra: { type: Number, optional: true },
    bpkk: { type: Number, optional: true },
    tn: { type: Number, optional: true },
    kepemudaan: { type: Number, optional: true },
    bko: { type: Number, optional: true },
    bpu: { type: Number, optional: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const dprLevelModel = ({ database: mongoose }) =>
  mongoose.model("target_suara", dprLevelSchema);
module.exports = dprLevelModel;

dprLevelModel[RESOLVER] = {
  name: "dprLevelSchema",
};
