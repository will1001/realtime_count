const { RESOLVER } = require("awilix");
const { Schema } = require("mongoose");
const { USER_STATUS } = require("../../../lib/variable.constant");

const userSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
    password: { type: String, required: true },
    id_kabupaten: { type: String, optional: true },
    api_gateway_secret: { type: String, required: true },
    api_gateway_key: { type: String, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const userModel = ({ database: mongoose }) =>
  mongoose.model("users", userSchema);
module.exports = userModel;

userModel[RESOLVER] = {
  name: "userSchema",
};
