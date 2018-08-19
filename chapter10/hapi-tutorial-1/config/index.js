const { env } = process;

const config = {
  HOST: env.HOST,
  PORT: env.PORT,
  JWT_SECRET: env.JWT_SECRET,
};
module.exports = config;
