const { RESOLVER } = require("awilix");
const { Schema } = require("mongoose");

const kabupatenSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const kabupatenModel = ({ database: mongoose }) =>
  mongoose.model("kabupatens", kabupatenSchema);
module.exports = kabupatenModel;

kabupatenModel[RESOLVER] = {
  name: "kabupatenSchema",
};
