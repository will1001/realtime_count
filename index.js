require("dotenv").config();
require("make-promises-safe");

const startHttp = require("./infrastructure/webserver/fastify");
const bootstrap = require("./infrastructure/bootstrap");
const consumer = require("./ports/broker/Listener");
const rabbit = require("./ports/broker/RabbitMQ");
const container = bootstrap();
const app = startHttp(container);
const { APP_PORT } = process.env;

const RabbitMQ = rabbit();
consumer(RabbitMQ, container);

app.listen(APP_PORT, "0.0.0.0", (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.cron.startAllJobs();
});
