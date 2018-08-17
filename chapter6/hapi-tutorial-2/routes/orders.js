const GROUP_NAME = 'orders'

module.exports = [
  {
    method: 'POST',
    path: `/${GROUP_NAME}`,
    handler: async (request, reply) => {
      reply()
    },
    config: {
      tags: ['api', GROUP_NAME],
      description: '创建订单',
    }
  },
  {
    method: 'POST',
    path: `/${GROUP_NAME}/{orderId}/pay`,
    handler: async (request, reply) => {
      reply()
    },
    config: {
      tags: ['api', GROUP_NAME],
      description: '支付某条订单',
    }
  },
]