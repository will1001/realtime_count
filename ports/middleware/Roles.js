var roles_allow = [];

const user = async (req, res, next) => {
  const { auth } = req;
  auth.roles_allow.push("users");
};

const ketua_tim = async (req, res, next) => {
  const { auth } = req;
  auth.roles_allow.push("ketua_tim");
};
const relawan = async (req, res, next) => {
  const { auth } = req;
  auth.roles_allow.push("relawan");
};
const koordinator = async (req, res, next) => {
  const { auth } = req;
  auth.roles_allow.push("koordinator");
};
const admin = async (req, res, next) => {
  const { auth } = req;
  auth.roles_allow.push("admin");
};

const check = async (req, res, next) => {
  const { auth } = req;
  console.log(auth.roles_allow);
  if (!auth.roles.some((ai) => auth.roles_allow.includes(ai)))
    res.status(403).send({
      message: "Access Forbidden",
    });
};

module.exports = {
  user,
  ketua_tim,
  relawan,
  koordinator,
  admin,
  check,
};
