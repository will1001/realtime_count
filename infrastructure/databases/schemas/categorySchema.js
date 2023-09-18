const { RESOLVER } = require("awilix");
const { Schema } = require("mongoose");

const categorySchema = new Schema(
  {
    _id: { type: Number, required: true },
    name: { type: String, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const categoryModel = ({ database: mongoose }) =>
  mongoose.model("Categories", categorySchema);
module.exports = categoryModel;

categoryModel[RESOLVER] = {
  name: "categorySchema",
};
