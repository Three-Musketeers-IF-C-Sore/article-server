require("dotenv").config();

module.exports = {
    HOST: process.env.MYSQL_HOST,
    USER: process.env.MYSQL_DB_USERNAME,
    PASSWORD: process.env.MYSQL_DB_PASSWORD,
    DB: process.env.MYSQL_DB_NAME,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0, 
        acquire: 30000,
        idle: 10000
    }
};