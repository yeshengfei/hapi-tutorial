const { env } = process;

const config = {
  host: env.HOST,
  port: env.PORT,
};
module.exports = config;
