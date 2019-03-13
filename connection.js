var mysql = require('mysql');

const PropertiesReader = require('properties-reader');
const prop = PropertiesReader('./properties/connection.properties');
const host = prop.get('host');
const username = prop.get('username')
const password = prop.get('password')
const database = prop.get('database')

var con = mysql.createConnection({
    host: host,
    user: username,
    password: password,
    database: database
});
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});
module.exports = con;