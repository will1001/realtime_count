const auth = async (req, res, next) => {
  const { headers } = req;
  if (!headers.authorization) {
    res.status(401).send({
      message: "Unauthorized",
    });
  }
  if (!headers["x-consumer-custom-id"]) {
    res.status(401).send({
      message: "Unauthorized",
    });
  }
  const user = {
    id: headers["x-consumer-custom-id"] ?? null,
    authorization: headers.authorization ?? null,
    username: headers["x-consumer-username"] ?? null,
    roles: headers["x-consumer-groups"]
      ? headers["x-consumer-groups"].replace(/\s/g, "").split(",")
      : [],
    roles_allow: [],
  };
  console.log(user);
  req.auth = user;
};

module.exports = auth;
