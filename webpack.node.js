
module.exports = require('./scripts/webpack.base')({
  env: 'production',
  target: 'node',
  serverPort: process.env.PORT || 4000,
});
