require('dotenv').config();

module.exports = {
  "development": { 
    "username": process.env.DB_USER || 'root',
    "password": process.env.DB_PASS || '',
    "database": "kiviubanco",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "port": process.env.PortDb || "3306"//3306 Windows 3307 Ubuntu
  },
  "test": {
    "username": process.env.DB_USER || 'root',
    "password": process.env.DB_PASS || '',
    "database": "kiviubanco",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "local": "3306"
  },
  "production": {
    "username": process.env.DB_USER || 'root',
    "password": process.env.DB_PASS || '',
    "database": "kiviubanco",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "local": "3306"
  }
}