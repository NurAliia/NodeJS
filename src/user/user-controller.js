const express = require('express');
const cors = require('cors')
const router = express.Router();
const bodyParser = require('body-parser');
const { validateRemotely } = require('./user.js');
const { User } = require('../db.js');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(cors());

router.get('/', async function (req, res) {
  res.set({
    "Access-Control-Allow-Origin" : "*",
    "Access-Control-Allow-Credentials" : true,
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTION',
    'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
  });
  try {
    const users = await User.findAll({
      attributes: [ 'id', 'login', 'password', 'age', 'isDeleted' ]
    });
    res.status(200).send(users);
  } catch (e) {
    if (e) return res.status(500).send(`Method name: GET, Args: Nothing. There was a problem finding the users. Message ${e}`);
  }
});

router.post('/add', validateSchema(), async function (req, res) {
  const userData = {
    id: req.body.id,
    login: req.body.login,
    password: req.body.password,
    age: req.body.age,
    isDeleted: req.body.isDeleted,
  };
  try {
    const user = await User.create(userData);
    res.status(200).send(user);
  } catch (e) {
    if (e) return res.status(500).send(`Method name: POST, Args: UserData. There was a problem adding the information to the database. Message ${e}`);
  }
});

router.get('/:id', async function (req, res) {
  res.set({
      "Access-Control-Allow-Origin" : "*",
      "Access-Control-Allow-Credentials" : true,
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTION',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
  });
  const id = req.params.id;
  try {
    const user = await User.findOne({
      attributes: [ 'id', 'login', 'password', 'age', 'isDeleted' ],
      where: {
        id
      }
    });
    res.status(200).send(user);
  } catch (e) {
    if (e) return res.status(500).send(`Method name: GET, Args: UserId. There was a problem finding the user. Message ${e}`);
  }
});

router.put("/:id", validateSchema(), async function (req, res) {
  try {
    const user = await User.update(req.body, {
      where: {
        id: req.params.id
      }
    });
    res.status(200).send(`Successfully updated user with id = ${req.params.id}`);
  } catch (e) {
    if (e) return res.status(500).send(`Method name: Put, Args: UserId. There was a problem update the user. Message ${e}`);
  }
});

router.delete("/:id", async function (req, res) {
  try {
    await User.destroy({
      where: {
        id: req.params.id
      }
    });
    res.status(200).send(`Successfully deleted user with id = ${req.params.id}`);
  } catch (e) {
    if (e) return res.status(500).send(`Method name: DELETE, Args: UserId. There was a problem delete the user. Message ${e}`);
  }
});

function errorResponse (schemaErrors) {
  const errors = schemaErrors.map((error) => {
    let { path, message } = error;
    return { path, message };
  });
  return {
    status: 'failed',
    errors,
  }
}

function validateSchema () {
  return (req, res, next) => {
    const { error } = validateRemotely(req.body)
    if (error) {
      res.status(400).json(errorResponse(error.details));
    } else {
      next();
    }
  }
}

module.exports = router;
