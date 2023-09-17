const { ValidationError } = require("joi");
const fs = require("fs");

const UserController = (container) => ({
  hello: async (req, res) => {
    try {
      res.status(200).send("hello");
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
  registSimpatisan: async (req, res) => {
    const { registSimpatisan } = container;
    try {
      const response = await registSimpatisan(req);
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
  getSimpatisan: async (req, res) => {
    const { getSimpatisan } = container;
    try {
      const response = await getSimpatisan(req);
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
  getRelawan: async (req, res) => {
    const { getRelawan } = container;
    try {
      const response = await getRelawan(req);
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
  postArticle: async (req, res) => {
    const { postArticle } = container;
    try {
      const response = await postArticle(req);
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
  getArticles: async (req, res) => {
    const { getArticles } = container;
    try {
      const response = await getArticles(req);
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
  getArticle: async (req, res) => {
    const { getArticle } = container;
    try {
      const response = await getArticle(req);
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
  updateArticle: async (req, res) => {
    const { updateArticle } = container;
    try {
      const response = await updateArticle(req);
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
  deleteArticle: async (req, res) => {
    const { deleteArticle } = container;
    try {
      const response = await deleteArticle(req);
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
  publicationArticle: async (req, res) => {
    const { publicationArticle } = container;
    try {
      const response = await publicationArticle(req);
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
  createSlider: async (req, res) => {
    const { createSlider } = container;
    try {
      const response = await createSlider(req);
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
  updateSlider: async (req, res) => {
    const { updateSlider } = container;
    try {
      const response = await updateSlider(req);
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
  deleteSlider: async (req, res) => {
    const { deleteteSlider } = container;
    try {
      const response = await deleteteSlider(req);
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
  getDptDps: async (req, res) => {
    const { getDptDps } = container;
    try {
      const response = await getDptDps(req);
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
  postLogistik: async (req, res) => {
    const { postLogistik } = container;
    try {
      const response = await postLogistik(req);
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
  getLogistik: async (req, res) => {
    const { getLogistik } = container;
    try {
      const response = await getLogistik(req);
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
  deleteLogistik: async (req, res) => {
    const { deleteLogistik } = container;
    try {
      const response = await deleteLogistik(req);
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
  postAspirasi: async (req, res) => {
    const { postAspirasi } = container;
    try {
      const response = await postAspirasi(req);
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
  editAspirasi: async (req, res) => {
    const { editAspirasi } = container;
    try {
      const response = await editAspirasi(req);
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
  deleteAspirasi: async (req, res) => {
    const { deleteAspirasi } = container;
    try {
      const response = await deleteAspirasi(req);
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
  getAspirasi: async (req, res) => {
    const { getAspirasi } = container;
    try {
      const response = await getAspirasi(req);
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
  sendOTPResetPassword: async (req, res) => {
    const { sendOTPResetPassword } = container;
    try {
      const response = await sendOTPResetPassword(req);
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
  resetPassword: async (req, res) => {
    const { resetPassword } = container;
    try {
      const response = await resetPassword(req);
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
  getSlider: async (req, res) => {
    const { getSlider } = container;
    try {
      const response = await getSlider(req);
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
  getJobs: async (req, res) => {
    const { getJobs } = container;
    try {
      const response = await getJobs(req);
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
  setTarget: async (req, res) => {
    const { setTarget } = container;
    try {
      const response = await setTarget(req);
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
  detailTarget: async (req, res) => {
    const { detailTarget } = container;
    try {
      const response = await detailTarget(req);
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
  detailTargetPerKabupaten: async (req, res) => {
    const { detailTargetPerKabupaten } = container;
    try {
      const response = await detailTargetPerKabupaten(req);
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
  editUser: async (req, res) => {
    const { editUser } = container;
    try {
      const response = await editUser(req);
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
  deleteUser: async (req, res) => {
    const { deleteUser } = container;
    try {
      const response = await deleteUser(req);
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
  getPeriode: async (req, res) => {
    const { getPeriode } = container;
    try {
      const response = await getPeriode(req);
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
  postPeriode: async (req, res) => {
    const { postPeriode } = container;
    try {
      const response = await postPeriode(req);
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
  getAkunTim: async (req, res) => {
    const { getAkunTim } = container;
    try {
      const response = await getAkunTim(req);
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
  checkNIK: async (req, res) => {
    const { checkNIK } = container;
    try {
      const response = await checkNIK(req);
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
  getCurrentDetailTargetDesaInput: async (req, res) => {
    const { getCurrentDetailTargetDesaInput } = container;
    try {
      const response = await getCurrentDetailTargetDesaInput(req);
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
  registSimpatisanByRelawan: async (req, res) => {
    const { registSimpatisanByRelawan } = container;
    try {
      const response = await registSimpatisanByRelawan(req);
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
  changeLogistikStatus: async (req, res) => {
    const { changeLogistikStatus } = container;
    try {
      const response = await changeLogistikStatus(req);
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
  saveToken: async (req, res) => {
    const { saveToken } = container;
    try {
      const response = await saveToken(req);
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
  postApk: async (req, res) => {
    const { postApk } = container;
    try {
      const response = await postApk(req);
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
  editApk: async (req, res) => {
    const { editApk } = container;
    try {
      const response = await editApk(req);
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
  deleteApk: async (req, res) => {
    const { deleteApk } = container;
    try {
      const response = await deleteApk(req);
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
  getApk: async (req, res) => {
    const { getApk } = container;
    try {
      const response = await getApk(req);
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
