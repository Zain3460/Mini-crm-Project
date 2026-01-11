require('dotenv').config();
const path = require('path');

module.exports = {
  app: {
    port: process.env.APP_PORT || 3000,
    env: process.env.NODE_ENV || 'development'
  },
  db: {
    dialect: 'sqlite',
    // mini-crm/dev.sqlite dosyasına kesin bağlan
    storage: path.resolve(__dirname, '../../dev.sqlite'),
    logging: false
  }
};
