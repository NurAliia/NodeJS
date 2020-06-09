const express = require('express');
const db = require('./db');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const UserController = require('./user/user-controller');
app.use('/users', UserController);

const GroupController = require('./group/group-controller');
app.use('/groups', GroupController);

app.get('/createdb', (req, res) => {
  let sql = 'CREATE DATABASE nodemysql';
  db.query(sql, (err, result) => {
    if (err) console.log('Issue' + err);
    console.log(result);
    result.send('database created....')
  })
})

module.exports = app;
