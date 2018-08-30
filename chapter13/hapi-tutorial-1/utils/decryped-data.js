// 封装的 decryptData，用于解码小程序的 encryptData

const crypto = require('crypto');

const decryptData = (encryptedData, iv, sessionKey, appid) => {
  // base64 decode
  const encryptedDataNew = Buffer.from(encryptedData, 'base64');
  const sessionKeyNew = Buffer.from(sessionKey, 'base64');
  const ivNew = Buffer.from(iv, 'base64');

  let decoded = '';
  try {
    // 解密，使用的算法是aes-128-cbc
    const decipher = crypto.createDecipheriv('aes-128-cbc', sessionKeyNew, ivNew);
    // 设置自动 padding 为 true，删除填充补位
    decipher.setAutoPadding(true);
    decoded = decipher.update(encryptedDataNew, 'binary', 'utf8');
    decoded += decipher.final('utf8');
    decoded = JSON.parse(decoded);
    // decoded是解密后的用户信息
  } catch (err) {
    throw new Error('Illegal Buffer');
  }

  // 解密后的用户数据中会有一个watermark属性，这个属性中包含这个小程序的appid和时间戳，下面是校验appid
  if (decoded.watermark.appid !== appid) {
    throw new Error('Illegal Buffer');
  }

  // 返回解密后的用户数据
  return decoded;
};

module.exports = decryptData;
