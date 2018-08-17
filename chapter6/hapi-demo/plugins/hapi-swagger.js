module.exports = [
  require('inert'),
  require('vision'),
  {
    register: require('hapi-swagger'),
    options: {
      info: {
        title: '接口文档',
        version: require('package').version
      },
    }
  }
]