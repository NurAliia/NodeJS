const express = require('express');
const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nodemysql'
})

db.connect(err => {
  if (err) {
    console.log("Issue:" + err);
  }
  console.log('MySql connected');
})

const app = express();

app.get('/createdb', (req, res) => {
  let sql = 'CREATE DATABASE nodemysql';
  db.query(sql, (err, result) => {
    if (err) console.log('Issue' + err);
    console.log(result);
    result.send('database created....')
  })
})

app.listen('3001', () => {
  console.log("Server started on port 3001");
})