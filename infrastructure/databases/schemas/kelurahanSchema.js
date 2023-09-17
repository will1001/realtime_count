const { RESOLVER } = require("awilix");
const { Schema } = require("mongoose");

const kelurahanSchema = new Schema(
  {
    _id: { type: String, required: true },
    id_kecamatan: { type: String, required: true },
    name: { type: String, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const kelurahanModel = ({ database: mongoose }) =>
  mongoose.model("kelurahans", kelurahanSchema);
module.exports = kelurahanModel;

kelurahanModel[RESOLVER] = {
  name: "kelurahanSchema",
};
