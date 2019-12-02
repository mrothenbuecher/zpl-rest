var local_config = require('../config.json');
var fs = require('fs');

class Config {
  constructor() {
    this.defaultConfig = {
      port: 8000,
      websocket_port: 8001,
      public: true,
      secret: "top_secret"
    };

    this.currentConfig = {};
    this.currentConfig = Object.assign(this.currentConfig, this.defaultConfig, local_config);

  }

  getConfig() {
    return this.currentConfig;
  }

}

module.exports = new Config();
