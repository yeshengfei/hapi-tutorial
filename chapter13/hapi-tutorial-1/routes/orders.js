const Joi = require('joi');
const xml2js = require('xml2js');
const axios = require('axios');
const crypto = require('crypto');
const models = require('../models');
const config = require('../config');
const { jwtHeaderDefine } = require('../utils/router-helper');

const GROUP_NAME = 'orders';

module.exports = [
  {
    method: 'POST',
    path: `/${GROUP_NAME}`,
    handler: async (request, reply) => {
      await models.sequelize.transaction((t) => {
        const result = models.orders.create(
          { user_id: request.auth.credentials.userId },
          { transaction: t },
        ).then((order) => {
          const goodsList = [];
          request.payload.goodsList.forEach((item) => {
            goodsList.push(models.order_goods.create({
              order_id: order.dataValues.id,
              goods_id: item.goods_id,
              // 此处单价的数值应该从商品表中反查出写入，出于教程的精简性而省略该步骤
              single_price: 4.9,
              count: item.count,
            }));
          });
          return Promise.all(goodsList);
        });
        return result;
      }).then(() => {
        // 事务已被提交
        reply('success');
      }).catch(() => {
        // 事务已被回滚
        reply('error');
      });
    },
    config: {
      tags: ['api', GROUP_NAME],
      description: '创建订单',
      validate: {
        payload: {
          goodsList: Joi.array().items(
            Joi.object().keys({
              goods_id: Joi.number().integer(),
              count: Joi.number().integer(),
            }),
          ),
        },
        ...jwtHeaderDefine,
      },
    },
  },
  {
    method: 'POST',
    path: `/${GROUP_NAME}/{orderId}/pay`,
    handler: async (request, reply) => {
      // 从用户表中获取 openid
      const user = await models.users.findOne({ where: { id: request.auth.credentials.userId } });
      const { openid } = user;
      // 构造 unifiedorder 所需入参
      const unifiedorderObj = {
        appid: config.wxAppid, // 小程序id
        body: '小程序支付', // 商品简单描述
        mch_id: config.wxMchid, // 商户号
        nonce_str: Math.random().toString(36).substr(2, 15), // 随机字符串
        notify_url: 'https://yourhost.com/orders/pay/notify', // 支付成功的回调地址
        openid, // 用户 openid
        out_trade_no: request.params.orderId, // 商户订单号
        spbill_create_ip: request.info.remoteAddress, // 调用支付接口的用户 ip
        total_fee: 1, // 总金额，单位为分
        trade_type: 'JSAPI', // 交易类型，默认
      };
      // 签名的数据
      const getSignData = (rawData, apiKey) => {
        let keys = Object.keys(rawData);
        keys = keys.sort();
        let string = '';
        keys.forEach((key) => {
          string += `&${key}=${rawData[key]}`;
        });
        string = string.substr(1);
        return crypto.createHash('md5').update(`${string}&key=${apiKey}`).digest('hex').toUpperCase();
      };
      // 将基础数据信息 sign 签名
      const sign = getSignData(unifiedorderObj, config.wxPayApiKey);
      // 需要被 post 的数据源
      const unifiedorderWithSign = {
        ...unifiedorderObj,
        sign,
      };
      // 将需要 post 出去的订单参数，转换位 xml 格式
      const builder = new xml2js.Builder({ rootName: 'xml', headless: true });
      const unifiedorderXML = builder.buildObject(unifiedorderWithSign);
      const result = await axios({
        url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
        method: 'POST',
        data: unifiedorderXML,
        headers: { 'content-type': 'text/xml' },
      });
      // result 是一个 xml 结构的 response，转换为 jsonObject，并返回前端
      xml2js.parseString(result.data, (err, parsedResult) => {
        if (parsedResult.xml) {
          if (parsedResult.xml.return_code[0] === 'SUCCESS'
          && parsedResult.xml.result_code[0] === 'SUCCESS') {
            // 待签名的原始支付数据
            const replyData = {
              appId: parsedResult.xml.appid[0],
              timeStamp: (Date.now() / 1000).toString(),
              nonceStr: parsedResult.xml.nonce_str[0],
              package: `prepay_id=${parsedResult.xml.prepay_id[0]}`,
              signType: 'MD5',
            };
            replyData.paySign = getSignData(replyData, config.wxPayApiKey);
            reply(replyData);
          }
        }
      });
    },
    config: {
      tags: ['api', GROUP_NAME],
      description: '支付某条订单',
      validate: {
        params: {
          orderId: Joi.string().required(),
        },
        ...jwtHeaderDefine,
      },
    },
  },
  {
    method: 'POST',
    path: `/${GROUP_NAME}/pay/notify`,
    handler: async (request, reply) => {
      xml2js.parseString(request.payload, async (err, parsedResult) => {
        if (parsedResult.xml.return_code[0] === 'SUCCESS') {
          // 微信统一支付状态成功，需要检验本地数据的逻辑一致性
          // 省略...细节逻辑校验
          // 更新该订单编号下的支付状态未已支付
          const orderId = parsedResult.xml.out_trade_no[0];
          const orderResult = await models.orders.findOne({ where: { id: orderId } });
          orderResult.payment_status = '1';
          await orderResult.save();
          // 返回微信，校验成功
          const retVal = {
            return_code: 'SUCCESS',
            return_msg: 'OK',
          };
          const builder = new xml2js.Builder({
            rootName: 'xml',
            headless: true,
          });
          reply(builder.buildObject(retVal));
        }
      });
    },
    config: {
      tags: ['api', GROUP_NAME],
      description: '微信支付成功的消息推送',
      auth: false,
    },
  },
];
