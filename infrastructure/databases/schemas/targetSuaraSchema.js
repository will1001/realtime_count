const { RESOLVER } = require("awilix");
const { Schema } = require("mongoose");

const targetSuaraSchema = new Schema(
  {
    _id: { type: String, required: true },
    id_dapil: { type: Number, required: true },
    anggota: { type: Number, optional: true },
    dpc: { type: Number, optional: true },
    dpra: { type: Number, optional: true },
    bpkk: { type: Number, optional: true },
    tn: { type: Number, optional: true },
    kepemudaan: { type: Number, optional: true },
    bko: { type: Number, optional: true },
    bpu: { type: Number, optional: true },
    id_dpr_level: { type: Number, optional: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const targetSuaraModel = ({ database: mongoose }) =>
  mongoose.model("target_suara", targetSuaraSchema);
module.exports = targetSuaraModel;

targetSuaraModel[RESOLVER] = {
  name: "targetSuaraSchema",
};
