const { RESOLVER } = require("awilix");
const axios = require("axios");

const UserApiGateway = ({}) => ({
  createConsumer: async (user) => {
    const { username, custom_id } = user;
    const { API_GATEWAY_ADMIN_URL } = process.env;
    try {
      return await axios.post(`${API_GATEWAY_ADMIN_URL}consumers`, {
        username: username,
        custom_id: custom_id,
      });
    } catch (error) {
      throw error;
    }
  },
  updateConsumer: async (user) => {
    const { old_username, username, custom_id } = user;
    const { API_GATEWAY_ADMIN_URL } = process.env;

    try {
      return await axios.patch(
        `${API_GATEWAY_ADMIN_URL}consumers/${old_username}`,
        {
          username: username,
          custom_id: custom_id,
        }
      );
    } catch (error) {
      throw error;
    }
  },
  getConsumer: async (user) => {
    const { username } = user;
    const { API_GATEWAY_ADMIN_URL } = process.env;

    try {
      return await axios.get(`${API_GATEWAY_ADMIN_URL}consumers/${username}`);
    } catch (error) {
      return error;
    }
  },
  deleteConsumer: async (user) => {
    const { username } = user;
    const { API_GATEWAY_ADMIN_URL } = process.env;

    try {
      return await axios.delete(
        `${API_GATEWAY_ADMIN_URL}consumers/${username}`
      );
    } catch (error) {
      throw error;
    }
  },

  createCredential: async (user) => {
    const { username } = user;
    const { API_GATEWAY_ADMIN_URL } = process.env;

    try {
      return await axios.post(
        `${API_GATEWAY_ADMIN_URL}consumers/${username}/jwt`
      );
    } catch (error) {
      throw error;
    }
  },
  getCredential: async (user) => {
    const { username } = user;
    const { API_GATEWAY_ADMIN_URL } = process.env;

    try {
      return await axios.get(
        `${API_GATEWAY_ADMIN_URL}consumers/${username}/jwt`
      );
    } catch (error) {
      return error;
    }
  },

  getConsumerAcl: async (user) => {
    const { username } = user;
    const { API_GATEWAY_ADMIN_URL } = process.env;

    try {
      return await axios.get(
        `${API_GATEWAY_ADMIN_URL}consumers/${username}/acls`
      );
    } catch (error) {
      throw error;
    }
  },
  addConsumerAcl: async (user) => {
    const { username, group } = user;
    const { API_GATEWAY_ADMIN_URL } = process.env;

    try {
      return await axios.post(
        `${API_GATEWAY_ADMIN_URL}consumers/${username}/acls`,
        {
          group: group,
        }
      );
    } catch (error) {
      throw error;
    }
  },
  updateConsumerAcl: async (user) => {
    const { username, group } = user;
    const { API_GATEWAY_ADMIN_URL } = process.env;

    const checkConsumerGroup = await axios.get(
      `${API_GATEWAY_ADMIN_URL}consumers/${username}/acls/${group}`
    );

    if (checkConsumerGroup) {
      await axios.delete(
        `${API_GATEWAY_ADMIN_URL}consumers/${username}/acls/${group}`
      );
    }

    try {
      return await axios.post(
        `${API_GATEWAY_ADMIN_URL}consumers/${username}/acls`,
        {
          group: group,
        }
      );
    } catch (error) {
      throw error;
    }
  },
});

module.exports = UserApiGateway;
UserApiGateway[RESOLVER] = {
  name: "UserApiGateway",
};
