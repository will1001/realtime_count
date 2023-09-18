const { RESOLVER } = require("awilix");
const { Schema } = require("mongoose");

const bcadSchema = new Schema(
  {
    _id: { type: Number, required: true },
    category_id: { type: Number, required: true },
    name: { type: String, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const bcadModel = ({ database: mongoose }) =>
  mongoose.model("bcad", bcadSchema);
module.exports = bcadModel;

bcadModel[RESOLVER] = {
  name: "bcadSchema",
};
