const { RESOLVER } = require("awilix");
const { Schema } = require("mongoose");

const upaSchema = new Schema(
  {
    _id: { type: Number, required: true },
    sub_category_id: { type: Number, required: true },
    name: { type: String, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const upaModel = ({ database: mongoose }) => mongoose.model("upa", upaSchema);
module.exports = upaModel;

upaModel[RESOLVER] = {
  name: "upaSchema",
};
