var mysql = require('mysql')
var pool = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Varsha@2003',
    database: 'paymentwallet',
    multipleStatements: true,
    connectionLimit: 100,
});

module.exports = pool
