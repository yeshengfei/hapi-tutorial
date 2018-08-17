const Hapi = require('hapi');

const server = new Hapi.Server();
// 配置服务器启动host与端口
server.connection({
  port: 3000,
  host: '127.0.0.1',
});

const init = async () => {
  server.route([
    // 创建一个简单的hello hapi接口
    {
      method: 'GET',
      path: '/',
      handler: (request, reply) => {
        reply('hello hapi');
      },
    },
  ]);
  // 启动服务
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

init();
