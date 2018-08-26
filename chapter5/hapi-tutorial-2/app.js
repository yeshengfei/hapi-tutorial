const Hapi = require('hapi');
const config = require('./config');
const routesHelloHapi = require('./routes/hello-hapi');

const server = new Hapi.Server();
// 配置服务器启动host与端口
server.connection({
  port: config.port,
  host: config.host,
});

const init = async () => {
  server.route([
    // 创建一个简单的hello hapi接口
    ...routesHelloHapi,
  ]);
  // 启动服务
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

init();
