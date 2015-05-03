module.exports = require('./scripts/webpack.base')({
  hotloader: true,
  serverPort: process.env.PORT || 4000,
  hotServerPort: 4001,
  env: process.env.NODE_ENV || 'development',
  target: 'web',
});
