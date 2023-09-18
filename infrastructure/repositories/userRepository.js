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
  getCategory: async (req) => {
    return await userMongo.getCategory(req);
  },
  getSubCategory: async (req) => {
    return await userMongo.getSubCategory(req);
  },
});

module.exports = userRepository;
userRepository[RESOLVER] = {
  name: "userRepository",
};
