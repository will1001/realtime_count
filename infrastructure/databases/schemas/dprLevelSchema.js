const { RESOLVER } = require("awilix");
const { Schema } = require("mongoose");

const dprLevelSchema = new Schema(
  {
    _id: { type: Number, required: true },
    name: { type: String, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const dprLevelModel = ({ database: mongoose }) =>
  mongoose.model("dpr_levels", dprLevelSchema);
module.exports = dprLevelModel;

dprLevelModel[RESOLVER] = {
  name: "dprLevelSchema",
};
