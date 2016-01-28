var config = {};

config.ratio = 1.0; // 1.0 all inserts, 0.0 all deletes
config.pause = 5 // seconds
config.padding = 2 // seconds

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
