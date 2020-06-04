const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');
const { userSchema, validateRemotely } = require('./user.ts');

app.listen(3000);
app.use(bodyParser.json());
app.use('/', router);

data=[];

router.get('/', function(req, res){
  res.json(data);
})

router.get('/autoSuggestUsers', function(req, res){
  res.json(
    getAutoSuggestUsers(req.query.loginSubstring, req.query.limit)
  );
})

router.get('/user/:id', function(req, res) {
  let user = _.find(data, { id: req.params.id });
  if (user === undefined) {
    res.status(404)
      .json({message: `User with id ${req.params.id} not found`})
  } else {
    res.json(user);
  }
})

router.post('/add', validateSchema(userSchema), (req, res) => {
  const user = req.body;
  user._id = uuidv4();
  data.push(user);
  res.status(204).json(user);
})

router.put('/user/:id', validateSchema(userSchema), (req, res) => {
  let index = _.findIndex(data, { id: req.params.id.toString() });
  if (index === undefined) {
    res.status(404)
    .json({message: `User with id ${req.params.id} not found`})
  } else {
    data.splice(index, 1, { ...req.body, id: req.params.id.toString() });
    res.status(204).json(data[index]);
  }
})

router.delete('/user/:id', (req, res) => {
  let index = _.findIndex(data, { id: req.params.id.toString() });
  if (index === undefined) {
    res.status(404)
    .json({message: `User with id ${req.params.id} not found`})
  } else {
    data.splice(index, 1, { ...data[index], isDeleted: true });
    res.status(204).json(data[index]);
  }
})

function getAutoSuggestUsers(loginSubstring, limit){
  let datalimit = _.slice(data, 0, limit);
  users = _.filter(datalimit,  item => {
    return item.login.indexOf(loginSubstring.toString()) > 0;
  });
  users = _.orderBy(users, ['login']); // Use Lodash to sort array by 'login'
  return users;
}

function errorResponse (schemaErrors) {
  const errors = schemaErrors.map(error => {
    let { path, message } = error;
    return { path, message };
  });
  return {
    status: 'failed',
    errors,
  }
}

function validateSchema (schema) {
  return (req, res, next) => {
    const { error } = validateRemotely(req.body)
    if (error) {
      res.status(400).json(errorResponse(error.details));
    } else {
      next();
    }
  }
}