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
  simpatisanSchema,
  artikelSchema,
  sliderSchema,
  logistikSchema,
  aspirasiSchema,
  userOTPSchema,
  pekerjaanSchema,
  targetSuaraSchema,
  suaraPeriodeLaluSchema,
  kabupatenSchema,
  kecamatanSchema,
  kelurahanSchema,
  periodeSchema,
  dataDPTDPSSchema,
  usersFCMTokenSchema,
  apkSchema,
  anggotaJaringanSchema,
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
      $or: [{ nik: data.nik }, { email: data.email }],
    });

    const findAnggotaJaringan = await anggotaJaringanSchema.findOne({
      nik: data.nik,
    });

    if (findAnggotaJaringan)
      return { data: "NIK Sudah Terdaftar di anggota jaringan" };

    try {
      if (findUser) {
        if (findUser.role === "simpatisan") {
          // await userSchema.deleteOne({ _id: findUser._id });
          await simpatisanSchema.deleteOne({ user_id: findUser._id });
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
          findUser.password = data.password;
          findUser.role = "relawan";
          findUser.status = USER_STATUS.ACTIVE;
          findUser.api_gateway_secret = credential.data.secret;
          findUser.api_gateway_key = credential.data.key;

          await findUser.save();
          return { messages: "Pendaftaran Berhasil Silahkan Login" };
        } else {
          await userSchema.update({ nik: data.nik }, { $set: { ...data } });
          return { messages: "Akun Anda Sudah Di Perbaharui" };
        }
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
          status: USER_STATUS.ACTIVE,
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

    if (user.status !== USER_STATUS.ACTIVE) {
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
  registSimpatisan: async (req) => {
    const { body } = req;
    const {
      name,
      id_periode,
      id_relawan,
      nik,
      email,
      place_birth,
      date_birth,
      gender,
      phone,
      pekerjaan,
      id_kabupaten,
      id_kecamatan,
      target_desa,
      address,
    } = body;
    const _id = uuidv4();

    const findUser = await userSchema.findOne({ $or: [{ nik }, { email }] });

    try {
      if (findUser) {
        await userSchema.update({ _id: findUser._id }, { $set: { ...body } });

        if (id_relawan) {
          await simpatisanSchema.update(
            { user_id: findUser._id },
            { $set: { id_relawan } }
          );
        }

        return { messages: "Akun Anda Sudah Diperbaharui" };
      } else {
        const user = new userSchema({
          _id,
          id_periode,
          name,
          nik,
          role: "simpatisan",
          email,
          phone,
          pekerjaan,
          id_kabupaten,
          id_kecamatan,
          target_desa,
          status: USER_STATUS.INACTIVE,
          api_gateway_secret: "credential.data.secret",
          api_gateway_key: "credential.data.key",
          password: "12345678",
          place_birth,
          date_birth,
          gender,
          address,
        });

        await user.save();

        const simpatisan = new simpatisanSchema({
          _id: uuidv4(),
          user_id: _id,
          id_relawan,
        });

        await simpatisan.save();
        return { messages: "Pendaftaran simpatisan Berhasil" };
      }
    } catch (err) {
      throw err;
    }
  },
  getSimpatisan: async (req) => {
    const { auth, query } = req;
    const { page, limit, id_kabupaten, id_kecamatan, keyword, id_relawan } =
      query;

    let filter = { role: "simpatisan" };
    let filter_relawan = { id_relawan: auth.id };
    let _limit = 10;

    if (id_kabupaten !== undefined) {
      filter["id_kecamatan"] = new RegExp(id_kabupaten, "i");
    }
    if (id_kecamatan !== undefined) {
      filter["id_kecamatan"] = new RegExp(id_kecamatan, "i");
    }
    if (keyword !== undefined) {
      let filterArray = [];
      filter = { $or: filterArray };
      filterArray.push({ name: { $regex: new RegExp(keyword, "i") } });
    }

    if (id_relawan !== undefined) filter.id_relawan = id_relawan;
    if (limit !== undefined) _limit = limit;
    if (keyword !== undefined) {
      let filterArray = [];
      filter = { $and: [{ role: "relawan" }, { $or: filterArray }] };
      filterArray.push({ name: { $regex: new RegExp(keyword, "i") } });
      filterArray.push({ email: { $regex: new RegExp(keyword, "i") } });
      filterArray.push({ phone: { $regex: new RegExp(keyword, "i") } });
    }

    try {
      let data;
      let totalData;
      if (auth.roles.includes("relawan")) {
        totalData = await userSchema.aggregate([
          {
            $match: filter,
          },
          {
            $lookup: {
              from: "simpatisans",
              localField: "_id",
              foreignField: "user_id",
              as: "simpatisan",
              pipeline: [
                {
                  $match: filter_relawan,
                },
              ],
            },
          },
          { $unwind: "$simpatisan" },

          {
            $lookup: {
              from: "pekerjaans",
              localField: "pekerjaan",
              foreignField: "_id",
              as: "pekerjaan",
            },
          },
          {
            $unwind: {
              path: "$pekerjaan",
              preserveNullAndEmptyArrays: true,
            },
          },
        ]);

        data = await userSchema.aggregate([
          {
            $match: filter,
          },
          {
            $lookup: {
              from: "simpatisans",
              localField: "_id",
              foreignField: "user_id",
              as: "simpatisan",
              pipeline: [
                {
                  $match: filter_relawan,
                },
              ],
            },
          },
          { $unwind: "$simpatisan" },

          {
            $lookup: {
              from: "pekerjaans",
              localField: "pekerjaan",
              foreignField: "_id",
              as: "pekerjaan",
            },
          },
          {
            $unwind: {
              path: "$pekerjaan",
              preserveNullAndEmptyArrays: true,
            },
          },
          { $skip: Number(_limit) * (Number(page) - 1) },
          { $limit: Number(_limit) },
        ]);
      } else {
        console.log("filter");
        console.log(filter);
        totalData = await userSchema.aggregate([
          {
            $lookup: {
              from: "simpatisans",
              localField: "_id",
              foreignField: "user_id",
              as: "simpatisan",
            },
          },

          {
            $unwind: {
              path: "$simpatisan",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $addFields: {
              id_relawan: "$simpatisan.id_relawan",
            },
          },
          {
            $lookup: {
              from: "pekerjaans",
              localField: "pekerjaan",
              foreignField: "_id",
              as: "pekerjaan",
            },
          },
          {
            $unwind: {
              path: "$pekerjaan",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $match: filter,
          },
        ]);
        data = await userSchema.aggregate([
          {
            $lookup: {
              from: "simpatisans",
              localField: "_id",
              foreignField: "user_id",
              as: "simpatisan",
            },
          },

          {
            $unwind: {
              path: "$simpatisan",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $addFields: {
              id_relawan: "$simpatisan.id_relawan",
            },
          },
          {
            $lookup: {
              from: "pekerjaans",
              localField: "pekerjaan",
              foreignField: "_id",
              as: "pekerjaan",
            },
          },
          {
            $unwind: {
              path: "$pekerjaan",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $match: filter,
          },
          { $skip: Number(_limit) * (Number(page) - 1) },
          { $limit: Number(_limit) },
        ]);
      }

      const metadata = {
        limit: Number(_limit),
        total: totalData.length,
        totalPage: Math.ceil(totalData.length / _limit),
        currentPage: Number(page),
      };

      return { metadata, data };
    } catch (err) {
      throw err;
    }
  },
  getRelawan: async (query) => {
    const {
      page,
      limit,
      pekerjaan,
      keyword,
      sort,
      id_kabupaten,
      id_kecamatan,
    } = query;
    let filter = { role: "relawan" };
    let sorts = { createdAt: -1 };
    let _limit = 10;

    if (id_kabupaten !== undefined) {
      filter["id_kecamatan"] = new RegExp(id_kabupaten, "i");
    }
    if (id_kecamatan !== undefined) {
      filter["id_kecamatan"] = new RegExp(id_kecamatan, "i");
    }
    if (keyword !== undefined) {
      let filterArray = [];
      filter = { $or: filterArray };
      filterArray.push({ name: { $regex: new RegExp(keyword, "i") } });
    }

    if (limit !== undefined) _limit = limit;
    if (pekerjaan !== undefined) filter.pekerjaan = pekerjaan;
    if (sort === "terbaru") sorts = { createdAt: -1 };
    if (sort === "terbanyak") sorts = { jumlah_simpatisans: -1 };
    if (keyword !== undefined) {
      let filterArray = [];
      filter = { $and: [{ role: "relawan" }, { $or: filterArray }] };
      filterArray.push({ name: { $regex: new RegExp(keyword, "i") } });
      filterArray.push({ email: { $regex: new RegExp(keyword, "i") } });
      filterArray.push({ phone: { $regex: new RegExp(keyword, "i") } });
    }

    try {
      const totalData = await userSchema.find(filter);

      const data = await userSchema.aggregate([
        {
          $match: filter,
        },
        {
          $lookup: {
            from: "simpatisans",
            localField: "_id",
            foreignField: "id_relawan",
            as: "simpatisans",
          },
        },

        {
          $addFields: {
            jumlah_simpatisans: {
              $size: ["$simpatisans"],
            },
          },
        },
        { $sort: sorts },

        {
          $lookup: {
            from: "kelurahans",
            localField: "target_desa",
            foreignField: "_id",
            as: "target_desa",
          },
        },
        { $unwind: "$target_desa" },
        {
          $lookup: {
            from: "pekerjaans",
            localField: "pekerjaan",
            foreignField: "_id",
            as: "pekerjaans",
          },
        },
        {
          $unwind: {
            path: "$pekerjaans",
            preserveNullAndEmptyArrays: true,
          },
        },
        { $skip: Number(_limit) * (Number(page) - 1) },
        { $limit: Number(_limit) },
      ]);

      const metadata = {
        limit: Number(_limit),
        total: totalData.length,
        totalPage: Math.ceil(totalData.length / _limit),
        currentPage: Number(page),
      };

      return { metadata, data };
    } catch (err) {
      throw err;
    }
  },
  postArticle: async (body) => {
    const {
      id_periode,
      title,
      id_kabupaten,
      id_kecamatan,
      id_kelurahan,
      description,
      category,
      publication,
      type,
      image,
      video,
    } = body;
    const _id = uuidv4();

    if (image && video)
      throw new Joi.ValidationError("image atau video harus salah satu saja");

    try {
      if (image) {
        if (image[0].filename === "")
          throw new Joi.ValidationError("Gambar File Tidak Boleh Kosong");
        const file = await image[0];

        const buff = await file.data;
        const extFile = image[0].filename.split(".").pop();
        const filename = `article_${_id}.${extFile}`;
        await storeFile(buff, "article", filename);
        const data = new artikelSchema({
          _id,
          id_periode,
          title,
          id_kabupaten,
          id_kecamatan,
          id_kelurahan,
          publication,
          description,
          type,
          category,
          image: "/article/" + filename,
        });

        await data.save();
        return { message: "Success", data };
      } else {
        const data = new artikelSchema({
          _id,
          id_periode,
          title,
          id_kabupaten,
          id_kecamatan,
          id_kelurahan,
          publication,
          description,
          type,
          category,
          video,
        });

        await data.save();
        return { message: "Success", data };
      }
    } catch (err) {
      throw err;
    }
  },
  getArticles: async (query) => {
    const { page, limit, id_kabupaten, keyword, id_kecamatan, type } = query;
    let filter = { type };
    let _limit = 10;

    if (limit !== undefined) _limit = limit;
    if (id_kabupaten !== undefined) {
      filter["id_kecamatan"] = new RegExp(id_kabupaten, "i");
    }
    if (id_kecamatan !== undefined) {
      filter["id_kecamatan"] = new RegExp(id_kecamatan, "i");
    }
    if (keyword !== undefined) {
      let filterArray = [];
      filter = { $or: filterArray };
      filterArray.push({ name: { $regex: new RegExp(keyword, "i") } });
    }

    try {
      const totalData = await artikelSchema.find({ type });
      const data = await artikelSchema.aggregate([
        {
          $match: filter,
        },
        { $sort: { createdAt: -1 } },
        {
          $lookup: {
            from: "kabupatens",
            localField: "id_kabupaten",
            foreignField: "_id",
            as: "kabupaten",
          },
        },
        {
          $unwind: {
            path: "$kabupaten",
            preserveNullAndEmptyArrays: true,
          },
        },

        { $skip: Number(_limit) * (Number(page) - 1) },
        { $limit: Number(_limit) },
      ]);

      const metadata = {
        limit: Number(_limit),
        total: totalData.length,
        totalPage: Math.ceil(totalData.length / _limit),
        currentPage: Number(page),
      };

      return { metadata, data };
    } catch (err) {
      throw err;
    }
  },
  getArticle: async (id) => {
    try {
      const data = await artikelSchema.aggregate([
        {
          $match: { _id: id },
        },
        {
          $lookup: {
            from: "kabupatens",
            localField: "_id",
            foreignField: "id_kabupaten",
            as: "kabupaten",
          },
        },
      ]);

      return { data: data[0] };
    } catch (err) {
      throw err;
    }
  },
  updateArticle: async (req) => {
    const { params, body } = req;
    const {
      id_periode,
      id_kabupaten,
      id_kecamatan,
      id_kelurahan,
      publication,
      title,
      description,
      category,
      image,
      video,
    } = body;
    let filename;
    let bodyEdit = { ...body };

    if (image && video)
      throw new Joi.ValidationError("image atau video harus salah satu saja");

    try {
      if (image) {
        if (image !== undefined) {
          const file = await image[0];
          const buff = await file.data;
          const extFile = image[0].filename.split(".").pop();

          filename = `article_${params.id}.${extFile}`;
          await storeFile(buff, "article", filename);
          bodyEdit = {
            id_periode,
            id_kabupaten,
            id_kecamatan,
            id_kelurahan,
            publication,
            title,
            description,
            category,
            image: "/article/" + filename,
            video: null,
          };
        }
      } else if (video) {
        const findArticle = await artikelSchema.findOne({ _id: params.id });

        removeFile("article", findArticle.image);

        bodyEdit = {
          id_periode,
          id_kabupaten,
          id_kecamatan,
          id_kelurahan,
          publication,
          title,
          description,
          category,
          image: null,
          video,
        };
      } else {
        bodyEdit = {
          id_periode,
          id_kabupaten,
          id_kecamatan,
          id_kelurahan,
          publication,
          title,
          description,
          category,
        };
      }
      const data = await artikelSchema.findByIdAndUpdate(
        { _id: params.id },
        { ...bodyEdit },
        {
          new: true,
        }
      );

      return { messages: "success" };
    } catch (err) {
      throw err;
    }
  },
  deleteArticle: async (id) => {
    try {
      const findArticle = await artikelSchema.findOne({ _id: id });
      const data = await artikelSchema.deleteOne({ _id: id });
      removeFile("article", findArticle.image);

      return { messages: "success" };
    } catch (err) {
      throw err;
    }
  },
  publicationArticle: async (req) => {
    const { params, body } = req;
    const { publication } = body;

    try {
      const data = await artikelSchema.findByIdAndUpdate(
        { _id: params.id },
        { publication },
        {
          new: true,
        }
      );

      return { messages: "success", data };
    } catch (err) {
      throw err;
    }
  },
  createSlider: async (body) => {
    const { image, type } = body;
    const _id = uuidv4();

    if (image === undefined)
      throw new Joi.ValidationError("Gambar File Tidak Boleh Kosong");
    if (image[0].filename === "")
      throw new Joi.ValidationError("Gambar File Tidak Boleh Kosong");

    const file = await image[0];
    const buff = await file.data;
    const filename = `slider_${_id}.png`;
    await storeImage(buff, "slider", filename);

    try {
      const data = new sliderSchema({
        _id,
        type,
        image: "/slider/" + filename,
      });

      await data.save();

      return { message: "Success", data };
    } catch (err) {
      throw err;
    }
  },
  updateSlider: async (req) => {
    const { params, body } = req;
    const { image } = body;

    const file = await image[0];
    const buff = await file.data;
    const filename = `slider_${params.id}.png`;
    await storeImage(buff, "slider", filename);

    try {
      const data = await sliderSchema.findByIdAndUpdate(
        { _id: params.id },
        { image: "/slider/" + filename },
        {
          new: true,
        }
      );

      return { messages: "success", data };
    } catch (err) {
      throw err;
    }
  },
  deleteSlider: async (id) => {
    try {
      const findSlider = await sliderSchema.findOne({ _id: id });
      const data = await sliderSchema.deleteOne({ _id: id });

      removeFile("slider", findSlider.image);

      return { messages: "success" };
    } catch (err) {
      throw err;
    }
  },
  getSlider: async (query) => {
    try {
      const data = await sliderSchema.find({ type: query.type });

      return { data };
    } catch (err) {
      throw err;
    }
  },
  getDptDps: async (query) => {
    const { page, limit, idKabupaten, idKecamatan, keyword } = query;

    let filter = { role: { $in: ["relawan", "simpatisan"] } };
    let _limit = 10;

    if (limit !== undefined) _limit = limit;
    if (idKabupaten !== undefined) {
      filter["id_kabupaten"] = new RegExp(idKabupaten, "i");
    }
    if (idKecamatan !== undefined) {
      filter["id_kecamtan"] = new RegExp(idKecamatan, "i");
    }
    if (keyword !== undefined) {
      let filterArray = [];
      filter = { $or: filterArray };
      filterArray.push({ name: { $regex: new RegExp(keyword, "i") } });
    }

    try {
      const totalData = await userSchema.find({});
      const data = await userSchema.aggregate([
        { $sort: { createdAt: -1 } },
        {
          $match: filter,
        },
        {
          $lookup: {
            from: "kabupatens",
            localField: "id_kabupaten",
            foreignField: "_id",
            as: "kabupaten",
          },
        },
        {
          $unwind: {
            path: "$kabupaten",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "kecamatans",
            localField: "id_kecamatan",
            foreignField: "_id",
            as: "kecamatan",
          },
        },
        {
          $unwind: {
            path: "$kecamatan",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "kelurahans",
            localField: "target_desa",
            foreignField: "_id",
            as: "kelurahan",
          },
        },
        {
          $unwind: {
            path: "$kelurahan",
            preserveNullAndEmptyArrays: true,
          },
        },

        { $skip: Number(_limit) * (Number(page) - 1) },
        { $limit: Number(_limit) },
      ]);

      const metadata = {
        limit: Number(_limit),
        total: totalData.length,
        totalPage: Math.ceil(totalData.length / _limit),
        currentPage: Number(page),
      };

      return { metadata, data };
    } catch (err) {
      throw err;
    }
  },
  postLogistik: async (req) => {
    const { auth, body } = req;
    const _id = uuidv4();

    try {
      const data = new logistikSchema({
        _id,
        id_relawan: auth.id,
        ...body,
      });

      await data.save();

      return { message: "Success", data };
    } catch (err) {
      throw err;
    }
  },
  getLogistik: async (req) => {
    const { auth, query } = req;

    const { page, limit, id_kabupaten, id_kecamatan } = query;

    let _limit = 10;

    if (limit !== undefined) _limit = limit;
    let filter = {};
    if (auth.roles[0] === "relawan") {
      filter.id_relawan = auth.id;
    }

    if (id_kabupaten) {
      filter.id_kabupaten = id_kabupaten;
    }

    if (id_kecamatan !== undefined) {
      filter["id_kecamatan"] = new RegExp(id_kecamatan, "i");
    }
    try {
      const totalData = await logistikSchema.find({});
      const data = await logistikSchema.aggregate([
        {
          $match: filter,
        },
        { $sort: { createdAt: -1 } },
        {
          $lookup: {
            from: "users",
            localField: "id_relawan",
            foreignField: "_id",
            as: "relawan",
          },
        },
        {
          $lookup: {
            from: "kabupatens",
            localField: "id_kabupaten",
            foreignField: "_id",
            as: "kabupaten",
          },
        },
        {
          $unwind: {
            path: "$kabupaten",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "kecamatans",
            localField: "id_kecamatan",
            foreignField: "_id",
            as: "kecamatan",
          },
        },
        {
          $unwind: {
            path: "$kecamatan",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "kelurahans",
            localField: "id_kelurahan",
            foreignField: "_id",
            as: "kelurahan",
          },
        },
        {
          $unwind: {
            path: "$kelurahan",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "apks",
            localField: "kebutuhan",
            foreignField: "_id",
            as: "apk",
          },
        },
        {
          $unwind: {
            path: "$apk",
            preserveNullAndEmptyArrays: true,
          },
        },
        { $skip: Number(_limit) * (Number(page) - 1) },
        { $limit: Number(_limit) },
      ]);

      const metadata = {
        limit: Number(_limit),
        total: totalData.length,
        totalPage: Math.ceil(totalData.length / _limit),
        currentPage: Number(page),
      };

      return { metadata, data };
    } catch (err) {
      throw err;
    }
  },
  deleteLogistik: async (id) => {
    try {
      const data = await logistikSchema.deleteOne({ _id: id });

      return { messages: "success" };
    } catch (err) {
      throw err;
    }
  },
  postAspirasi: async (req) => {
    const { body } = req;
    const _id = uuidv4();
    const {
      name,
      id_periode,
      email,
      phone,
      id_kabupaten,
      id_kecamatan,
      id_kelurahan,
      perihal,
      detail,
      image,
    } = body;
    let bodyEdit = body;
    if (image !== undefined) {
      const file = await image[0];
      const buff = await file.data;
      filename = `aspirasi_${_id}.png`;
      await storeImage(buff, "aspirasi", filename);
      bodyEdit = {
        name,
        id_periode,
        email,
        phone,
        id_kabupaten,
        id_kecamatan,
        id_kelurahan,
        perihal,
        detail,
        image: "/aspirasi/" + filename,
      };
    }

    try {
      const data = new aspirasiSchema({
        _id,
        ...bodyEdit,
      });

      await data.save();

      return { message: "Success", data };
    } catch (err) {
      throw err;
    }
  },
  editAspirasi: async (req) => {
    const { params, body } = req;

    const {
      name,
      email,
      phone,
      id_kabupaten,
      id_kecamatan,
      id_kelurahan,
      perihal,
      detail,
      image,
    } = body;
    let bodyEdit = body;
    if (image !== undefined) {
      const file = await image[0];
      const buff = await file.data;
      filename = `aspirasi_${params.id}.png`;
      removeFile("aspirasi", filename);
      await storeImage(buff, "aspirasi", filename);
      bodyEdit = {
        name,
        email,
        phone,
        id_kabupaten,
        id_kecamatan,
        id_kelurahan,
        perihal,
        detail,
        image: "/aspirasi/" + filename,
      };
    }

    try {
      const data = await aspirasiSchema.findByIdAndUpdate(
        { _id: params.id },
        { ...body },
        {
          new: true,
        }
      );

      return { messages: "success", data };
    } catch (err) {
      throw err;
    }
  },
  deleteAspirasi: async (id) => {
    try {
      const data = await aspirasiSchema.deleteOne({ _id: id });

      return { messages: "success" };
    } catch (err) {
      throw err;
    }
  },
  getAspirasi: async (req) => {
    const { query, auth } = req;
    const { page, limit } = query;
    let _limit = 10;

    if (limit !== undefined) _limit = limit;
    try {
      let totalData;

      let data;

      if (auth.roles[0] === "relawan") {
        const findUser = await userSchema.findOne({ _id: auth.id });
        totalData = await aspirasiSchema.find({ email: findUser.email });
        data = await aspirasiSchema.aggregate([
          { $match: { email: findUser.email } },
          { $sort: { createdAt: -1 } },
          {
            $lookup: {
              from: "users",
              localField: "email",
              foreignField: "email",
              as: "user",
            },
          },
          {
            $lookup: {
              from: "kabupatens",
              localField: "id_kabupaten",
              foreignField: "_id",
              as: "kabupaten",
            },
          },
          {
            $unwind: {
              path: "$kabupaten",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "kecamatans",
              localField: "id_kecamatan",
              foreignField: "_id",
              as: "kecamatan",
            },
          },
          {
            $unwind: {
              path: "$kecamatan",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "kelurahans",
              localField: "id_kelurahan",
              foreignField: "_id",
              as: "kelurahan",
            },
          },
          {
            $unwind: {
              path: "$kelurahan",
              preserveNullAndEmptyArrays: true,
            },
          },
          { $skip: Number(_limit) * (Number(page) - 1) },
          { $limit: Number(_limit) },
        ]);
      } else {
        totalData = await aspirasiSchema.find({});
        data = await aspirasiSchema.aggregate([
          { $sort: { createdAt: -1 } },
          {
            $lookup: {
              from: "users",
              localField: "user_id",
              foreignField: "_id",
              as: "user",
            },
          },
          {
            $lookup: {
              from: "kabupatens",
              localField: "id_kabupaten",
              foreignField: "_id",
              as: "kabupaten",
            },
          },
          {
            $unwind: {
              path: "$kabupaten",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "kecamatans",
              localField: "id_kecamatan",
              foreignField: "_id",
              as: "kecamatan",
            },
          },
          {
            $unwind: {
              path: "$kecamatan",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "kelurahans",
              localField: "id_kelurahan",
              foreignField: "_id",
              as: "kelurahan",
            },
          },
          {
            $unwind: {
              path: "$kelurahan",
              preserveNullAndEmptyArrays: true,
            },
          },
          { $skip: Number(_limit) * (Number(page) - 1) },
          { $limit: Number(_limit) },
        ]);
      }

      const metadata = {
        limit: Number(_limit),
        total: totalData.length,
        totalPage: Math.ceil(totalData.length / _limit),
        currentPage: Number(page),
      };

      return { metadata, data };
    } catch (err) {
      throw err;
    }
  },
  sendOTPResetPassword: async (req) => {
    const { body } = req;
    const { email } = body;
    const _id = uuidv4();

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    const client = Sib.ApiClient.instance;
    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.API_KEY_EMAIL;
    const tranEmailApi = new Sib.TransactionalEmailsApi();
    const sender = {
      email: "sjpberkhidmat@gmail.com",
      name: "SJP Berkhidmat",
    };
    const receivers = [
      {
        email: body.email,
      },
    ];

    tranEmailApi
      .sendTransacEmail({
        sender,
        to: receivers,
        subject: "SJP Berkhidmat",
        textContent: `
        {{params.sender}}.
        `,
        htmlContent: `
        <h3>{{params.sender}}</h3>
        <h1>Kode OTP ANDA : {{params.otp}}</h1>
                `,
        params: {
          sender: "SJP Berkhidmat",
          otp: otp,
        },
      })
      .then(console.log)
      .catch(console.log);
    try {
      const data = new userOTPSchema({
        _id,
        email,
        otp,
        expired_time: moment(Date.now()).add(5, "minutes").toDate().getTime(),
      });

      await data.save();

      return { data };
    } catch (err) {
      throw err;
    }
  },
  resetPassword: async (req) => {
    const { body } = req;
    const { otp, new_password, email } = body;

    const latestOTP = await userOTPSchema.aggregate([
      { $match: { otp, email } },
      { $sort: { createdAt: -1 } },
    ]);

    if (Date.now() > latestOTP[0].expired_time)
      throw new Joi.ValidationError(
        "Kode OTP Expired Silahkan Request Kode OTP Kembali"
      );

    if (latestOTP[0].otp != otp)
      throw new Joi.ValidationError("Kode OTP Salah");

    try {
      const hash = await hashPassword(new_password);
      const findUSer = await userSchema.findOne({ email });
      if (!findUSer) throw new Joi.ValidationError("Email Tidak Terdaftar");
      const data = await userSchema.findByIdAndUpdate(
        { _id: findUSer._id },
        { password: hash },
        {
          new: true,
        }
      );

      return { messages: "success", data };
    } catch (err) {
      throw err;
    }
  },
  getJobs: async (req) => {
    try {
      const data = await pekerjaanSchema.find({});

      return { data };
    } catch (err) {
      throw err;
    }
  },
  setTarget: async (body) => {
    const { id_kelurahan, target, id_periode, suara_periode_lalu } = body;
    try {
      const findTarget = await targetSuaraSchema.findOne({ id_kelurahan });
      const findSuaraPeriodeLalu = await suaraPeriodeLaluSchema.findOne({
        id_kelurahan,
      });

      const findKelurahan = await kelurahanSchema.findOne({
        _id: id_kelurahan,
      });

      if (!findKelurahan)
        throw new Joi.ValidationError("Desa Tidak Di Temukan");

      const findKecamatan = await kecamatanSchema.findOne({
        _id: findKelurahan.id_kecamatan,
      });

      if (!findKecamatan)
        throw new Joi.ValidationError("Kecamatan Tidak Di Temukan");

      const findKabupaten = await kabupatenSchema.findOne({
        _id: findKecamatan.id_kabupaten,
      });

      if (!findKabupaten)
        throw new Joi.ValidationError("Kabupaten Tidak Di Temukan");

      if (findTarget) {
        await targetSuaraSchema.update(
          { id_kelurahan },
          { $set: { target: target } }
        );
      } else {
        const _id = uuidv4();

        const data = new targetSuaraSchema({
          _id,
          id_periode,
          id_kabupaten: findKabupaten.id,
          id_kecamatan: findKecamatan.id,
          id_kelurahan,
          target,
        });

        await data.save();
      }

      if (findSuaraPeriodeLalu) {
        await suaraPeriodeLaluSchema.update(
          { id_kelurahan },
          { $set: { suara: suara_periode_lalu } }
        );
      } else {
        const _id = uuidv4();
        const data = new suaraPeriodeLaluSchema({
          _id,
          id_kabupaten: findKabupaten.id,
          id_kecamatan: findKecamatan.id,
          id_kelurahan,
          suara: suara_periode_lalu,
        });

        await data.save();
      }

      return { messages: "success" };
    } catch (err) {
      throw err;
    }
  },
  detailTargetPerKabupaten: async (req) => {
    const kabupaten = await kabupatenSchema.aggregate([
      {
        $match: { _id: { $in: ["5201", "5202", "5203", "5208", "5271"] } },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "id_kabupaten",
          as: "simpatisans",
          pipeline: [
            {
              $match: {
                role: "simpatisan",
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "id_kabupaten",
          as: "relawans",
          pipeline: [
            {
              $match: {
                role: "relawan",
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "jaringans",
          localField: "_id",
          foreignField: "id_kabupaten",
          as: "jaringans",
          pipeline: [
            {
              $lookup: {
                from: "anggotajaringans",
                localField: "_id",
                foreignField: "id_jaringan",
                as: "anggota_jaringans",
              },
            },
          ],
        },
      },

      {
        $lookup: {
          from: "targetsuaras",
          localField: "_id",
          foreignField: "id_kabupaten",
          as: "targets",
        },
      },
      {
        $addFields: {
          jumlah_simpatisans: {
            $size: ["$simpatisans"],
          },
          jumlah_relawans: {
            $size: ["$relawans"],
          },
          jumlah_anggota_jaringans: {
            $size: ["$jaringans.anggota_jaringans"],
          },
          total_target: {
            $sum: ["$targets.target"],
          },
        },
      },
    ]);
    try {
      return { data: kabupaten };
    } catch (err) {
      throw err;
    }
  },
  detailTarget: async (query) => {
    const { page, limit, id_kabupaten, keyword, sort, id_kecamatan } = query;
    let filter = {};
    let filterKabupaten = {};
    let sorts = { jumlah_simpatisans: -1 };
    let _limit = 10;

    if (limit !== undefined) _limit = limit;
    if (sort === "terkecil") sorts = { jumlah_simpatisans: 1 };
    if (sort === "terbanyak") sorts = { jumlah_simpatisans: -1 };
    if (id_kabupaten !== undefined) {
      filter["id_kecamatan"] = new RegExp(id_kabupaten, "i");
    }
    if (id_kecamatan !== undefined) {
      filter["id_kecamatan"] = new RegExp(id_kecamatan, "i");
    }
    if (keyword !== undefined) {
      let filterArray = [];
      filter = { $or: filterArray };
      filterArray.push({ name: { $regex: new RegExp(keyword, "i") } });
    }

    try {
      const totalData = await kelurahanSchema.aggregate([
        {
          $match: filter,
        },
        {
          $lookup: {
            from: "kecamatans",
            localField: "id_kecamatan",
            foreignField: "_id",
            as: "kecamatan",
            pipeline: [
              {
                $match: filterKabupaten,
              },
              {
                $lookup: {
                  from: "kabupatens",
                  localField: "id_kabupaten",
                  foreignField: "_id",
                  as: "kabupaten",
                },
              },
              {
                $unwind: {
                  path: "$kabupaten",
                  preserveNullAndEmptyArrays: true,
                },
              },
            ],
          },
        },
      ]);

      const data = await kelurahanSchema.aggregate([
        {
          $match: filter,
        },
        {
          $lookup: {
            from: "kecamatans",
            localField: "id_kecamatan",
            foreignField: "_id",
            as: "kecamatan",
            pipeline: [
              {
                $lookup: {
                  from: "kabupatens",
                  localField: "id_kabupaten",
                  foreignField: "_id",
                  as: "kabupaten",
                },
              },
              {
                $unwind: {
                  path: "$kabupaten",
                  preserveNullAndEmptyArrays: true,
                },
              },
            ],
          },
        },
        {
          $unwind: {
            path: "$kecamatan",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "targetsuaras",
            localField: "_id",
            foreignField: "id_kelurahan",
            as: "targets",
            pipeline: [
              {
                $lookup: {
                  from: "kabupatens",
                  localField: "id_kabupaten",
                  foreignField: "_id",
                  as: "kabupaten",
                },
              },
              { $unwind: "$kabupaten" },
              {
                $lookup: {
                  from: "kecamatans",
                  localField: "id_kecamatan",
                  foreignField: "_id",
                  as: "kecamatan",
                },
              },
              { $unwind: "$kecamatan" },
            ],
          },
        },
        {
          $unwind: {
            path: "$targets",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $lookup: {
            from: "datadptdpsses",
            localField: "_id",
            foreignField: "id_kelurahan",
            as: "dpt_dps",
          },
        },
        {
          $unwind: {
            path: "$dpt_dps",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "suaraperiodelalus",
            localField: "_id",
            foreignField: "id_kelurahan",
            as: "suara_periode_lalu",
          },
        },
        {
          $unwind: {
            path: "$suara_periode_lalu",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "target_desa",
            as: "simpatisans",
            pipeline: [
              {
                $match: {
                  role: "simpatisan",
                },
              },
            ],
          },
        },

        {
          $addFields: {
            id_kabupaten: "$kecamatan.id_kabupaten",
            jumlah_simpatisans: {
              $size: ["$simpatisans"],
            },
            status: {
              $round: {
                $multiply: [
                  {
                    $divide: [
                      {
                        $size: ["$simpatisans"],
                      },
                      "$targets.target",
                    ],
                  },
                  100,
                ],
              },
            },
          },
        },
        { $sort: sorts },
        { $skip: Number(_limit) * (Number(page) - 1) },
        { $limit: Number(_limit) },
      ]);

      const metadata = {
        limit: Number(_limit),
        total: totalData.length,
        totalPage: Math.ceil(totalData.length / _limit),
        currentPage: Number(page),
      };

      return { metadata, data };
    } catch (err) {
      throw err;
    }
  },
  editUser: async (user) => {
    try {
      await userSchema.update({ email: user.email }, { $set: { ...user } });

      return {};
    } catch (err) {
      throw err;
    }
  },
  deleteUser: async (email, UserApiGateway) => {
    try {
      const findUser = await userSchema.findOne({ email: email });

      if (findUser.role === "simpatisan") {
        await simpatisanSchema.deleteOne({ user_id: findUser._id });
      }
      await UserApiGateway.deleteConsumer({
        username: email,
      });
      const data = await userSchema.deleteOne({ email });

      return { messages: "success" };
    } catch (err) {
      throw err;
    }
  },
  getPeriode: async () => {
    try {
      const data = await periodeSchema.find({});

      return { data };
    } catch (err) {
      throw err;
    }
  },
  postPeriode: async (body) => {
    const { from, to } = body;
    try {
      const _id = uuidv4();
      const data = new periodeSchema({
        _id,
        from,
        to,
      });

      await data.save();

      return { data };
    } catch (err) {
      throw err;
    }
  },
  getAkunTim: async (query) => {
    const { page, limit } = query;
    let filter = { role: { $in: ["ketua_tim", "koordinator"] } };
    let _limit = 10;

    if (limit !== undefined) _limit = limit;

    try {
      const totalData = await userSchema.find(filter);

      const data = await userSchema.aggregate([
        {
          $match: filter,
        },
        {
          $lookup: {
            from: "kabupatens",
            localField: "id_kabupaten",
            foreignField: "_id",
            as: "kabupaten",
          },
        },
        {
          $unwind: {
            path: "$kabupaten",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "pekerjaans",
            localField: "pekerjaan",
            foreignField: "_id",
            as: "pekerjaans",
          },
        },
        {
          $unwind: {
            path: "$pekerjaans",
            preserveNullAndEmptyArrays: true,
          },
        },
        { $skip: Number(_limit) * (Number(page) - 1) },
        { $limit: Number(_limit) },
      ]);

      const metadata = {
        limit: Number(_limit),
        total: totalData.length,
        totalPage: Math.ceil(totalData.length / _limit),
        currentPage: Number(page),
      };

      return { metadata, data };
    } catch (err) {
      throw err;
    }
  },
  checkNIK: async (nik) => {
    const user = await userSchema.aggregate([
      { $match: { nik: { $regex: new RegExp(nik, "i") } } },
    ]);
    if (!user) {
      throw new Joi.ValidationError("NIK Belum Terdaftar");
    }
    console.log(user);
    try {
      return { data: user[0] };
    } catch (err) {
      throw err;
    }
  },
  getCurrentDetailTargetDesaInput: async (id_kelurahan) => {
    try {
      const targetSuara = await targetSuaraSchema.findOne({ id_kelurahan });
      const dataDPTDPS = await dataDPTDPSSchema.findOne({ id_kelurahan });
      const suaraPeriodeLalu = await suaraPeriodeLaluSchema.findOne({
        id_kelurahan,
      });
      let output = {
        jml_target: targetSuara.target,
        jml_penduduk: dataDPTDPS.jml_penduduk,
        jml_tps: dataDPTDPS.jml_tps,
        jml_dpt_dps: dataDPTDPS.jml_dpt_dps,
        suara_periode_lalu: suaraPeriodeLalu.suara,
      };
      return { data: output };
    } catch (err) {
      throw err;
    }
  },
  registSimpatisanByRelawan: async (req) => {
    const { auth, body } = req;
    const {
      name,
      id_periode,
      nik,
      email,
      place_birth,
      date_birth,
      gender,
      phone,
      pekerjaan,
      id_kabupaten,
      id_kecamatan,
      target_desa,
      address,
    } = body;
    const _id = uuidv4();

    const findUser = await userSchema.findOne({ $or: [{ nik }, { email }] });

    try {
      if (findUser) {
        await userSchema.update({ _id: findUser._id }, { $set: { ...body } });
      } else {
        const user = new userSchema({
          _id,
          id_periode,
          name,
          nik,
          role: "simpatisan",
          email,
          phone,
          pekerjaan,
          id_kabupaten,
          id_kecamatan,
          target_desa,
          status: USER_STATUS.INACTIVE,
          api_gateway_secret: "credential.data.secret",
          api_gateway_key: "credential.data.key",
          password: "12345678",
          place_birth,
          date_birth,
          gender,
          address,
        });

        await user.save();

        const simpatisan = new simpatisanSchema({
          _id: uuidv4(),
          user_id: _id,
          id_relawan: auth.id,
        });

        await simpatisan.save();

        return { messages: "Pendaftaran simpatisan Berhasil" };
      }
    } catch (err) {
      throw err;
    }
  },
  changeLogistikStatus: async (req) => {
    const { params, body } = req;
    const { id } = params;
    const { status, jml_logistik } = body;
    try {
      const findLogistik = await logistikSchema.findOne({ _id: id });
      const findApk = await apkSchema.findOne({ _id: findLogistik.kebutuhan });

      const totalKeluar = Number(findApk.jml_keluar) + Number(jml_logistik);

      if (findApk.jml_masuk < totalKeluar)
        return { data: "stok apk tidak cukup" };

      findApk.jml_keluar += Number(jml_logistik);
      findApk.save();

      await logistikSchema.update(
        { _id: id },
        { $set: { status, jumlah: jml_logistik } }
      );

      return {};
    } catch (err) {
      throw err;
    }
  },
  saveToken: async (req) => {
    const { auth, body } = req;
    const { token } = body;
    try {
      const findToken = await usersFCMTokenSchema.findOne({ user_id: auth.id });

      if (findToken) {
        await usersFCMTokenSchema.update(
          { user_id: auth.id },
          { $set: { token } }
        );
      } else {
        const _id = uuidv4();
        const userToken = new usersFCMTokenSchema({
          _id,
          token,
          user_id: auth.id,
        });
        await userToken.save();
      }

      return {};
    } catch (err) {
      throw err;
    }
  },
  postApk: async (body) => {
    const {
      id_periode,
      nama,
      tgl_masuk,
      tgl_keluar,
      jml_masuk,
      jml_keluar,
      tujuan,
      id_relawan,
    } = body;
    const _id = uuidv4();

    try {
      const data = new apkSchema({
        _id,
        id_periode,
        nama,
        tgl_masuk,
        tgl_keluar,
        jml_masuk,
        jml_keluar,
        tujuan,
        id_relawan,
      });

      await data.save();

      return { data: { _id } };
    } catch (err) {
      throw err;
    }
  },
  editApk: async (req) => {
    const { params, body } = req;
    const { id } = params;
    const {
      nama,
      tgl_masuk,
      tgl_keluar,
      jml_masuk,
      jml_keluar,
      tujuan,
      id_relawan,
    } = body;

    try {
      await apkSchema.update(
        { _id: id },
        {
          $set: {
            nama,
            tgl_masuk,
            tgl_keluar,
            jml_masuk,
            jml_keluar,
            tujuan,
            id_relawan,
          },
        }
      );

      return {};
    } catch (err) {
      throw err;
    }
  },
  deleteApk: async (id) => {
    try {
      await apkSchema.deleteOne({ _id: id });

      return {};
    } catch (err) {
      throw err;
    }
  },
  getApk: async (query) => {
    const { page, keyword, limit } = query;
    let filter = {};
    let _limit = 10;

    if (limit !== undefined) _limit = limit;

    if (keyword !== undefined) {
      let filterArray = [];
      filter = { $or: filterArray };
      // filterArray.push({ nama: { $regex: new RegExp(keyword, "i") } });
      filterArray.push({
        nama_relawan: { $regex: new RegExp(keyword, "i") },
      });
    }

    try {
      const totalData = await apkSchema.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "id_relawan",
            foreignField: "_id",
            as: "relawan",
          },
        },
        {
          $unwind: {
            path: "$relawan",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            nama_relawan: "$relawan.name",
          },
        },
        {
          $match: filter,
        },
        { $sort: { createdAt: -1 } },
      ]);
      const data = await apkSchema.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "id_relawan",
            foreignField: "_id",
            as: "relawan",
          },
        },
        {
          $unwind: {
            path: "$relawan",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            nama_relawan: "$relawan.name",
          },
        },
        {
          $match: filter,
        },
        { $sort: { createdAt: -1 } },
        { $skip: Number(_limit) * (Number(page) - 1) },
        { $limit: Number(_limit) },
      ]);

      const metadata = {
        limit: Number(_limit),
        total: totalData.length,
        totalPage: Math.ceil(totalData.length / _limit),
        currentPage: Number(page),
      };

      return { metadata, data };
    } catch (err) {
      throw err;
    }
  },
});

module.exports = userMongo;
userMongo[RESOLVER] = {
  name: "userMongo",
};
