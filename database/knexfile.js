const path = require("path");
const moment = require("moment");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const fs = require('fs');

// Read the CA certificate file
const filePath = path.join(__dirname, 'DigiCertGlobalRootCA.crt.pem');
const caCert = fs.readFileSync(filePath);


module.exports = {
  development: {
    client: "mysql",
    useNullAsDefault: true,
    connection: {
      charset: "utf8mb4",
      collation: 'utf8mb4_unicode_ci',
      database: process.env.DB_NAME || 'walkie_talkie_redesign',
      host: process.env.DB_HOST || '127.0.0.1', //127.0.0.1
      user: process.env.DB_USER || 'root', //'root'
      password: process.env.DB_PASSWORD || '', //'X&6wXJW!Iu*JdM*T',
      port: process.env.DB_PORT || 3306,
      ssl: {
         ca: caCert // CA certificate
      },
      
      
      typeCast: (field, next) => {
        if (field.type === "DATETIME") {
          return moment(field.string()).format("YYYY-MM-DD HH:mm:ss");
        }
        return next();
      },
    },
    pool: {
      min: 0,
      max: 10,
      // idleTimeoutMillis: 30000,
      // createTimeoutMillis: 30000,
      // acquireTimeoutMillis: 30000,
      // requestTimeout: 1,
    },
    migrations: {
      directory: __dirname + "/migrations",
    },
    seeds: {
      directory: __dirname + "/seeders",
    },
  },

  production: {
    client: "mysql",
    useNullAsDefault: true,
    connection: {
      charset: "utf8mb4",
      collation: 'utf8mb4_unicode_ci',
      database: process.env.DB_NAME || 'friends_map',
      host: process.env.DB_HOST || '127.0.0.1', //127.0.0.1
      user: process.env.DB_USER || 'root', //'root'
      password: process.env.DB_PASSWORD || '', //'X&6wXJW!Iu*JdM*T',
      port: process.env.DB_PORT || 3306,
      
      typeCast: (field, next) => {
        if (field.type === "DATETIME") {
          return moment(field.string()).format("YYYY-MM-DD HH:mm:ss");
        }
        return next();
      },
    },
    pool: {
      min: 0,
      max: 10,
      // idleTimeoutMillis: 30000,
      // createTimeoutMillis: 30000,
      // acquireTimeoutMillis: 30000,
      // requestTimeout: 1,
    },
    migrations: {
      directory: __dirname + "/migrations",
    },
    seeds: {
      directory: __dirname + "/seeders",
    },
  },
};
