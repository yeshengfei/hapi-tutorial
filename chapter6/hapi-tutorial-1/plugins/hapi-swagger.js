const inert = require('inert');
const vision = require('vision');
const packageModule = require('package');
const hapiSwagger = require('hapi-swagger');

module.exports = [
  inert,
  vision,
  {
    register: hapiSwagger,
    options: {
      info: {
        title: '接口文档',
        version: packageModule.version,
      },
      // 定义接口以tags属性定义为分组
      grouping: 'tags',
      tags: [
        { name: 'tests', description: '测试相关' },
      ],
    },
  },
];
