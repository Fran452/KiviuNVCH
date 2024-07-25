module.exports = {
  "development": {
    "username": "fran452",
    "password": 'desaFran2024!',
    "database": "kiviuTest",
    "host": "164.92.77.143",
    "dialect": "mysql",
    "port": process.env.PortDb || "3307"//3306 Windows 3307 Ubuntu
  },
  "test": {
    "username": "fran452",
    "password": 'desaFran2024!',
    "database": "kiviuTest",
    "host": "164.92.77.143",
    "dialect": "mysql",
    "local": "3307"
  },
  "production": {
    "username": "fran452",
    "password": 'desaFran2024!',
    "database": "kiviuTest",
    "host": "164.92.77.143",
    "dialect": "mysql",
    "local": "3307"
  }
}