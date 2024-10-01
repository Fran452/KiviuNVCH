require('dotenv').config();

module.exports = {
  "development": { 
    "username": process.env.KIVIU_DB_USER   || 'root',
    "password": process.env.KIVIU_DB_PASS   || '',
    "database": process.env.KIVIU_DB_NAME   || "kiviuBanco",
    "host"    : process.env.KIVIU_HOST      || "127.0.0.1",
    "dialect" : process.env.KIVIU_DB_DIALEC || "mysql",
    "port"    : process.env.KIVIU_DB_PORT   || "3306"
  },
  "test": {
    "username": process.env.KIVIU_DB_USER   || 'root',
    "password": process.env.KIVIU_DB_PASS   || '',
    "database": process.env.KIVIU_DB_NAME   || "kiviuBanco",
    "host"    : process.env.KIVIU_HOST      || "127.0.0.1",
    "dialect" : process.env.KIVIU_DB_DIALEC || "mysql",
    "local"   : process.env.KIVIU_DB_PORT   || "3306"
  },
  "production": {
    "username":  process.env.KIVIU_DB_USER   || 'root',
    "password":  process.env.KIVIU_DB_PASS   || '',
    "database":  process.env.KIVIU_DB_NAME   || "kiviuBanco",
    "host"    :  process.env.KIVIU_HOST      || "127.0.0.1",
    "dialect" :  process.env.KIVIU_DB_DIALEC || "mysql",
    "local"   :  process.env.KIVIU_DB_PORT   || "3306"
  }
}