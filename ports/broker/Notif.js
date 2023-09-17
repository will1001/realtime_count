const Notif = ({ RabbitMQ, logusersSchema }) => ({
  logsUser: async () => {
    const articles = new logusersSchema({
      _id: "asdadadd",
      title: "title",
    });

    await articles.save();
    return;
  },
});

module.exports = Notif;
