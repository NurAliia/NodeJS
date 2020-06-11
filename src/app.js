const express = require('express');
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');
const cors = require('cors');
const db = require('./db');
const app = express();

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'), {flags: 'a'}
);

process.on('uncaughtException', function (err) {
  console.log('Uncaught Exception', err);
})

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason);
});

app.use(cors())
// setup the logger
app.use(morgan('combined', {stream: accessLogStream}));
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' });
  } else {
    next(err);
  }
}

function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
}

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
