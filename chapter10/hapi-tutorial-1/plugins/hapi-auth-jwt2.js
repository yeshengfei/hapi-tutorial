const config = require('../config');

const validate = (decoded, request, callback) => {
  let error;
  // decoded 为 JWT payload 被解码后的数据
  const userId = decoded.userId || {};

  if (!userId) {
    return callback(error, false, userId);
  }
  return callback(error, true, {
    userId,
  });
};

module.exports = (server) => {
  server.auth.strategy('jwt', 'jwt', {
    key: config.JWT_SECRET,
    validateFunc: validate,
  });
  server.auth.default('jwt');
};
