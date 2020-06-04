const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');
const { userSchema, validateRemotely }=require('./user.ts');

app.listen(3000);
app.use(bodyParser.json());
app.use('/', router);

let data: any[] = [];

router.get('/', function(req: any, res: any){
  res.json(data);
})

router.get('/autoSuggestUsers', function(req: any, res: any){
  res.json(
    getAutoSuggestUsers(req.query.loginSubstring, req.query.limit)
  );
})

router.get('/user/:id', function(req: any, res: any) {
  let user = _.find(data, { id: req.params.id });
  if (user === undefined) {
    res.status(404)
      .json({message: `User with id ${req.params.id} not found`})
  } else {
    res.json(user);
  }
})

router.post('/add', validateSchema(userSchema), (req: any, res: any) => {
  const user = req.body;
  user._id = uuidv4();
  data.push(user);
  res.status(204).json(user);
})

router.put('/user/:id', validateSchema(userSchema), (req: any, res: any) => {
  let index = _.findIndex(data, { id: req.params.id.toString() });
  if (index === undefined) {
    res.status(404)
    .json({message: `User with id ${req.params.id} not found`})
  } else {
    data.splice(index, 1, { ...req.body, id: req.params.id.toString() });
    res.status(204).json(data[index]);
  }
})

router.delete('/user/:id', (req: any, res: any) => {
  let index = _.findIndex(data, { id: req.params.id.toString() });
  if (index === undefined) {
    res.status(404)
    .json({message: `User with id ${req.params.id} not found`})
  } else {
    data.splice(index, 1, { ...data[index], isDeleted: true });
    res.status(204).json(data[index]);
  }
})

function getAutoSuggestUsers(loginSubstring: any, limit: any){
  let datalimit = _.slice(data, 0, limit);
  let users = _.filter(datalimit,  (item: any) => {
    return item.login.indexOf(loginSubstring.toString()) > 0;
  });
  users = _.orderBy(users, ['login']); // Use Lodash to sort array by 'login'
  return users;
}

function errorResponse (schemaErrors: any) {
  const errors = schemaErrors.map((error: any) => {
    let { path, message } = error;
    return { path, message };
  });
  return {
    status: 'failed',
    errors,
  }
}

function validateSchema (schema: any) {
  return (req: any, res: any, next: any) => {
    const { error } = validateRemotely(req.body)
    if (error) {
      res.status(400).json(errorResponse(error.details));
    } else {
      next();
    }
  }
}