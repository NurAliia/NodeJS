const express = require('express');
const db = require('./db');
const app = express();
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'), {flags: 'a'}
);

// setup the logger
app.use(morgan('combined', {stream: accessLogStream}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const UserController = require('./user/user-controller');
app.use('/users', UserController);

const GroupController = require('./group/group-controller');
app.use('/groups', GroupController);

const UsersGroupController = require('./users-group/users-group-controller');
app.use('/usersgroup', UsersGroupController);

app.get('/createdb', (req, res) => {
  let sql = 'CREATE DATABASE nodemysql';
  db.query(sql, (err, result) => {
    if (err) console.log('Issue' + err);
    console.log(result);
    result.send('database created....')
  })
})

module.exports = app;
