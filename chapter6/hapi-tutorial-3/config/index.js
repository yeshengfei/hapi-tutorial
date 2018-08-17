const { env } = process;

const config = {
  HOST: env.HOST,
  PORT: env.PORT,
};
module.exports = config;
