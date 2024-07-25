module.exports = {
  "development": {
    "username": "fran452",
    "password": 'desaFran2024!',
    "database": "kiviuTest",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "port": process.env.PortDb || "3306"//3306 Windows 3307 Ubuntu
  },
  "test": {
    "username": "fran452",
    "password": 'desaFran2024!',
    "database": "kiviuTest",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "local": "3306"
  },
  "production": {
    "username": "fran452",
    "password": 'desaFran2024!',
    "database": "kiviuTest",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "local": "3306"
  }
}