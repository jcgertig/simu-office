
module.exports = require('./scripts/webpack.base')({
  env: process.env.NODE_ENV || 'development',
  target: 'node',
  serverPort: process.env.PORT || 4000,
});
