const { ValidationError } = require("joi");
const fs = require("fs");

const UserController = (container) => ({
  hello: async (req, res) => {
    try {
      res.status(200).send({ data: { message: "hello" } });
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
  register: async (req, res) => {
    const { register } = container;
    try {
      const response = await register(req);
      res.status(201).send(response);
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
  login: async (req, res) => {
    const { login } = container;
    try {
      const response = await login(req);
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
  getCategory: async (req, res) => {
    const { getCategory } = container;
    try {
      const response = await getCategory(req);
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
  getSubCategory: async (req, res) => {
    const { getSubCategory } = container;
    try {
      const response = await getSubCategory(req);
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

module.exports = UserController;
