var config = {};

config.marklogic = {
  host: 'localhost',
  port: '8000',
  user: 'admin',
  password: 'admin',
  authType: 'digest'
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = config;
}
