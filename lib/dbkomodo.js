'use strict';

const mysql = require('mysql');
const config = require('./config.json');

let connection = mysql.createConnection({
  host : config.mysql_komodo.host,
  user : config.mysql_komodo.user,
  password : config.mysql_komodo.password,
  database : config.mysql_komodo.database
});

module.exports = connection;
