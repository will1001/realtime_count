const { RESOLVER } = require("awilix");
const { Schema } = require("mongoose");

const subCategorySchema = new Schema(
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

const subCategoryModel = ({ database: mongoose }) =>
  mongoose.model("sub_categories", subCategorySchema);
module.exports = subCategoryModel;

subCategoryModel[RESOLVER] = {
  name: "subCategorySchema",
};
