const moment = require("moment");
moment.locale("id");
const _ = require("lodash");
const { Op } = require("sequelize");
const container = require("../../infrastructure/bootstrap/container");
const fs = require("fs");

const BackupData = async () => {
  const userSchema = await container().resolve("userSchema");
  const artikelSchema = await container().resolve("artikelSchema");
  const aspirasiSchema = await container().resolve("aspirasiSchema");
  const calonSchema = await container().resolve("calonSchema");
  const logistikSchema = await container().resolve("logistikSchema");
  const partaiSchema = await container().resolve("partaiSchema");
  const planoSchema = await container().resolve("planoSchema");
  const simpatisanSchema = await container().resolve("simpatisanSchema");
  const sliderSchema = await container().resolve("sliderSchema");
  const targetSuaraSchema = await container().resolve("targetSuaraSchema");
  const userOTPSchema = await container().resolve("userOTPSchema");
  const periodeSchema = await container().resolve("periodeSchema");

  const dateNow = Date.now().toString();
  dir = `uploads/backup/${dateNow}`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  try {
    const users = await userSchema.find({});
    const artikels = await artikelSchema.find({});
    const aspirasis = await aspirasiSchema.find({});
    const calons = await calonSchema.find({});
    const logistiks = await logistikSchema.find({});
    const partais = await partaiSchema.find({});
    const planos = await planoSchema.find({});
    const simpatisans = await simpatisanSchema.find({});
    const sliders = await sliderSchema.find({});
    const targetSuaras = await targetSuaraSchema.find({});
    const userOTPs = await userOTPSchema.find({});
    const periodes = await periodeSchema.find({});
    if (users.length > 0) {
      fs.writeFileSync(`./${dir}/users.json`, JSON.stringify(users));
    }
    if (artikels.length > 0) {
      fs.writeFileSync(`./${dir}/artikels.json`, JSON.stringify(artikels));
    }

    if (aspirasis.length > 0) {
      fs.writeFileSync(`./${dir}/aspirasis.json`, JSON.stringify(aspirasis));
    }

    if (calons.length > 0) {
      fs.writeFileSync(`./${dir}/calons.json`, JSON.stringify(calons));
    }

    if (logistiks.length > 0) {
      fs.writeFileSync(`./${dir}/logistiks.json`, JSON.stringify(logistiks));
    }

    if (partais.length > 0) {
      fs.writeFileSync(`./${dir}/partais.json`, JSON.stringify(partais));
    }

    if (planos.length > 0) {
      fs.writeFileSync(`./${dir}/planos.json`, JSON.stringify(planos));
    }

    if (simpatisans.length > 0) {
      fs.writeFileSync(
        `./${dir}/simpatisans.json`,
        JSON.stringify(simpatisans)
      );
    }

    if (sliders.length > 0) {
      fs.writeFileSync(`./${dir}/sliders.json`, JSON.stringify(sliders));
    }

    if (targetSuaras.length > 0) {
      fs.writeFileSync(
        `./${dir}/targetSuaras.json`,
        JSON.stringify(targetSuaras)
      );
    }

    if (userOTPs.length > 0) {
      fs.writeFileSync(`./${dir}/userOTPs.json`, JSON.stringify(userOTPs));
    }
    if (periodes.length > 0) {
      fs.writeFileSync(`./${dir}/periodes.json`, JSON.stringify(periodes));
    }

    console.log("Cron job auto backup Data has RUN!");
  } catch (error) {
    throw error;
  }
};

module.exports = BackupData;
