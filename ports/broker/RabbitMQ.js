const amqplib = require("amqplib");
const { RABBITMQ_HOST } = process.env;

const RabbitMQ = async () => {
  try {
    const conn = await amqplib.connect(`${RABBITMQ_HOST}`);
    return conn;
  } catch (err) {
    throw err;
  }
};

module.exports = RabbitMQ;
