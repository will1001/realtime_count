const Joi = require("joi");
const { RESOLVER } = require("awilix");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const { storeImage, removeFile, storeFile } = require("../../../lib/storage");
const moment = require("moment-timezone");
const { USER_STATUS } = require("../../../lib/variable.constant");
const Sib = require("sib-api-v3-sdk");
require("dotenv").config();
const otpGenerator = require("otp-generator");
const { hashPassword } = require("../../../lib/bcrypt");

const userMongo = ({
  userSchema,
  kabupatenSchema,
  kecamatanSchema,
  dapilSchema,
  categorySchema,
  subCategorySchema,
}) => ({
  lookupEmail: async (email) => {
    const user = await userSchema.findOne({
      email: email,
      status: USER_STATUS.ACTIVE,
    });
    return user;
  },
  lookupNIK: async (nik) => {
    console.log("nik");
    console.log(nik);

    const user = await userSchema.findOne({
      nik: nik,
    });
    return user;
  },

  lookupPhone: async (phone_number) => {
    const user = await userSchema.findOne({
      phone: phone_number,
      status: USER_STATUS.ACTIVE,
    });
    return user;
  },

  findByEmail: async (email) => {
    const user = await userSchema.findOne({
      email: email,
      status: USER_STATUS.ACTIVE,
    });

    return user;
  },

  findByPhone: async (phone) => {
    const user = await userSchema.findOne({
      phone: phone,
      status: USER_STATUS.ACTIVE,
    });
    return user;
  },

  register: async (data, UserApiGateway) => {
    const _id = uuidv4();

    const findUser = await userSchema.findOne({
      $or: [{ email: data.email }],
    });

    try {
      if (findUser) {
        throw new Joi.ValidationError("user sudah terdaftar");
      } else {
        await UserApiGateway.createConsumer({
          username: data.email,
          custom_id: _id,
        });

        const credential = await UserApiGateway.createCredential({
          username: data.email,
        });

        await UserApiGateway.addConsumerAcl({
          username: data.email,
          group: data.role,
        });

        const user = new userSchema({
          _id,
          ...data,
          api_gateway_secret: credential.data.secret,
          api_gateway_key: credential.data.key,
        });

        await user.save();
        return { messages: "Pendaftaran Berhasil Silahkan Login" };
      }
    } catch (err) {
      throw err;
    }
  },
  login: async (user, UserApiGateway) => {
    const key = user.api_gateway_key;
    const secret = user.api_gateway_secret;

    const consumer = await UserApiGateway.getConsumer({
      username: user.email,
    });
    if (!consumer.status) {
      throw new Joi.ValidationError("user not verified");
    }

    const credential = await UserApiGateway.getCredential({
      username: user.email,
    });
    if (!credential.status) {
      throw new Joi.ValidationError("user not verified");
    }

    if (!consumer) {
      throw new Joi.ValidationError("user not verified");
    }

    if (credential.message === "Not found") {
      throw new Joi.ValidationError("user credential not found");
    }

    if (credential.data.data[0].secret !== secret) {
      throw new Joi.ValidationError("user secret incorrect");
    }

    const token = jwt.sign(
      { id: user.id, name: user.nama, email: user.email },
      secret,
      {
        header: {
          typ: "JWT",
          alg: "HS256",
          iss: key,
        },
      }
    );

    const consumerAcl = await UserApiGateway.getConsumerAcl({
      username: user.email,
    });

    let roles = "relawan";

    for (const consumer of consumerAcl.data.data) {
      if (consumer.group === "koordinator") roles = "koordinator";
      if (consumer.group === "ketua_tim") roles = "ketua_tim";
      if (consumer.group === "admin") roles = "admin";
    }

    return {
      access_token: token,
      name: user.name,
      email: user.email,
      roles: roles,
      id_kabupaten: user.id_kabupaten,
    };
  },
  getCategory: async (req) => {
    const data = await categorySchema.find();

    return { data };
  },
  getSubCategory: async (req) => {
    const { id_category } = req.params;
    const data = await subCategorySchema.find({ category_id: id_category });

    return { data };
  },
  getDapil: async (req) => {
    const data = await dapilSchema.find();

    return { data };
  },
});

module.exports = userMongo;
userMongo[RESOLVER] = {
  name: "userMongo",
};
