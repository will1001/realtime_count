const each = require("lodash/fp/each");
const fastify = require("fastify");
const fastifyStatic = require("@fastify/static");
const path = require("path");
const multipart = require("@fastify/multipart");
const { RABBITMQ_HOST } = process.env;
const fastifyCron = require("fastify-cron");
const CronJobs = require("../../ports/cron/CronJobs");
const cors = require("@fastify/cors");

module.exports = ({ routes, LoggerConfig }) => {
  const server = fastify({
    logger: LoggerConfig,
  });
  server.register(require("fastify-amqp"), {
    // the default value is amqp
    url: `${RABBITMQ_HOST}`,
    // protocol: 'amqp',
    // hostname: 'localhost',
    // // the default value is 5672
    // port: 5672,
    // // the default value is guest
    // username: 'guest',
    // // the default value is guest
    // password: 'guest'
    // // the default value is empty
    // vhost: ''
  });
  server.register(multipart, { addToBody: true });
  each((path) => {
    server.route(path);
  })(routes);

  /**
   * Setup Docs and Coverage static file serving
   */
  server.register(fastifyStatic, {
    root: path.join(__dirname, "../.."),
    redirect: true,
  });

  server.register(fastifyCron, {
    jobs: [
      {
        cronTime: "0 * * * *", // Everyday at midnight UTC
        onTick: async (server) => {
          // await CronJobs.BackupData();
        },
      },
    ],
  });

  server.register(cors, {
    origin: true, // Allow all origins
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  });

  server.get("/invoice", (req, res) => {
    res.sendFile("html/invoice.html");
  });
  // server.get('/docs/', (req, res) => { res.sendFile('docs/') })
  //   server.get('/coverage/', (req, res) => { res.sendFile('coverage/') })

  return server;
  // "^3.9.2"
};
