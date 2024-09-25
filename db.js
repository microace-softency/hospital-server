const mysql = require('mysql2/promise')
require("dotenv").config();

const mysqlPool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DATABASE
})

module.exports = mysqlPool