const { RESOLVER } = require("awilix");

const userRepository = ({ userMongo, UserApiGateway }) => ({
  lookupNIK: async (nik) => {
    return await userMongo.lookupNIK(nik);
  },
  lookupEmail: async (email) => {
    return await userMongo.lookupEmail(email);
  },
  register: async (user) => {
    return await userMongo.register(user, UserApiGateway);
  },
  login: async (user) => {
    return await userMongo.login(user, UserApiGateway);
  },
  registSimpatisan: async (req) => {
    return await userMongo.registSimpatisan(req);
  },
  getSimpatisan: async (req) => {
    return await userMongo.getSimpatisan(req);
  },
  getRelawan: async (query) => {
    return await userMongo.getRelawan(query);
  },
  postArticle: async (body) => {
    return await userMongo.postArticle(body);
  },
  getArticles: async (query) => {
    return await userMongo.getArticles(query);
  },
  getArticle: async (id) => {
    return await userMongo.getArticle(id);
  },
  updateArticle: async (req) => {
    return await userMongo.updateArticle(req);
  },
  deleteArticle: async (id) => {
    return await userMongo.deleteArticle(id);
  },
  publicationArticle: async (req) => {
    return await userMongo.publicationArticle(req);
  },
  createSlider: async (body) => {
    return await userMongo.createSlider(body);
  },
  updateSlider: async (req) => {
    return await userMongo.updateSlider(req);
  },
  deleteSlider: async (id) => {
    return await userMongo.deleteSlider(id);
  },
  getDptDps: async (id) => {
    return await userMongo.getDptDps(id);
  },
  postLogistik: async (req) => {
    return await userMongo.postLogistik(req);
  },
  getLogistik: async (req) => {
    return await userMongo.getLogistik(req);
  },
  deleteLogistik: async (id) => {
    return await userMongo.deleteLogistik(id);
  },
  postAspirasi: async (req) => {
    return await userMongo.postAspirasi(req);
  },
  editAspirasi: async (req) => {
    return await userMongo.editAspirasi(req);
  },
  deleteAspirasi: async (id) => {
    return await userMongo.deleteAspirasi(id);
  },
  getAspirasi: async (req) => {
    return await userMongo.getAspirasi(req);
  },
  sendOTPResetPassword: async (req) => {
    return await userMongo.sendOTPResetPassword(req);
  },
  resetPassword: async (req) => {
    return await userMongo.resetPassword(req);
  },
  getSlider: async (query) => {
    return await userMongo.getSlider(query);
  },
  getJobs: async (req) => {
    return await userMongo.getJobs(req);
  },
  setTarget: async (body) => {
    return await userMongo.setTarget(body);
  },
  detailTarget: async (query) => {
    return await userMongo.detailTarget(query);
  },
  detailTargetPerKabupaten: async (req) => {
    return await userMongo.detailTargetPerKabupaten(req);
  },
  editUser: async (user) => {
    return await userMongo.editUser(user);
  },
  deleteUser: async (email) => {
    return await userMongo.deleteUser(email, UserApiGateway);
  },
  getPeriode: async () => {
    return await userMongo.getPeriode();
  },
  postPeriode: async (body) => {
    return await userMongo.postPeriode(body);
  },
  getAkunTim: async (body) => {
    return await userMongo.getAkunTim(body);
  },
  checkNIK: async (nik) => {
    return await userMongo.checkNIK(nik);
  },
  getCurrentDetailTargetDesaInput: async (id_kelurahan) => {
    return await userMongo.getCurrentDetailTargetDesaInput(id_kelurahan);
  },
  registSimpatisanByRelawan: async (req) => {
    return await userMongo.registSimpatisanByRelawan(req);
  },
  changeLogistikStatus: async (req) => {
    return await userMongo.changeLogistikStatus(req);
  },
  saveToken: async (req) => {
    return await userMongo.saveToken(req);
  },
  postApk: async (body) => {
    return await userMongo.postApk(body);
  },
  editApk: async (req) => {
    return await userMongo.editApk(req);
  },
  deleteApk: async (id) => {
    return await userMongo.deleteApk(id);
  },
  getApk: async (id) => {
    return await userMongo.getApk(id);
  },
});

module.exports = userRepository;
userRepository[RESOLVER] = {
  name: "userRepository",
};
