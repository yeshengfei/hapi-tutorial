const Hapi = require('hapi');
require('env2')('./.env');
const config = require('./config');
const routesHelloHapi = require('./routes/hello-hapi');
const routesShops = require('./routes/shops');
const routesOrders = require('./routes/orders');
const pluginHapiSwagger = require('./plugins/hapi-swagger');

const server = new Hapi.Server();
// 配置服务器启动host与端口
server.connection({
  port: config.port,
  host: config.host,
});

const init = async () => {
  await server.register([
    ...pluginHapiSwagger,
  ]);
  server.route([
    // 创建一个简单的hello hapi接口
    ...routesHelloHapi,
    ...routesShops,
    ...routesOrders,
  ]);
  // 启动服务
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

init();
