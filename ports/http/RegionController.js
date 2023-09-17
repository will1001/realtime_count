const { ValidationError } = require("joi");
const fs = require("fs");

const RegionController = (container) => ({
  getKabupaten: async (req, res) => {
    const { getKabupaten } = container;
    try {
      const response = await getKabupaten(req);
      res.status(200).send(response);
    } catch (err) {
      console.log(err);
      if (err instanceof ValidationError) {
        res.status(400).send({
          message: err.message,
        });
      } else {
        res.status(500).send({
          message: err.message,
        });
      }
    }
  },
  getKecamatan: async (req, res) => {
    const { getKecamatan } = container;
    try {
      const response = await getKecamatan(req);
      res.status(200).send(response);
    } catch (err) {
      console.log(err);
      if (err instanceof ValidationError) {
        res.status(400).send({
          message: err.message,
        });
      } else {
        res.status(500).send({
          message: err.message,
        });
      }
    }
  },
  getKelurahan: async (req, res) => {
    const { getKelurahan } = container;
    try {
      const response = await getKelurahan(req);
      res.status(200).send(response);
    } catch (err) {
      console.log(err);
      if (err instanceof ValidationError) {
        res.status(400).send({
          message: err.message,
        });
      } else {
        res.status(500).send({
          message: err.message,
        });
      }
    }
  },
  getKelurahans: async (req, res) => {
    const { getKelurahans } = container;
    try {
      const response = await getKelurahans(req);
      res.status(200).send(response);
    } catch (err) {
      console.log(err);
      if (err instanceof ValidationError) {
        res.status(400).send({
          message: err.message,
        });
      } else {
        res.status(500).send({
          message: err.message,
        });
      }
    }
  },
});

module.exports = RegionController;
