const Joi = require('joi');
const models = require('../models');
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
      reply();
    },
    config: {
      tags: ['api', GROUP_NAME],
      description: '支付某条订单',
      validate: {
        params: {
          orderId: Joi.string().required(),
        },
      },
    },
  },
];
