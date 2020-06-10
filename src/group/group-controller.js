const express = require('express');
const cors = require('cors')
const router = express.Router();
const bodyParser = require('body-parser');
const { validateRemotely } = require('./group.js');
const { Group } = require('../db.js');
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
    const groups = await Group.findAll({
      attributes: [ 'id', 'name', 'permission' ]
    });
    res.status(200).send(groups);
  } catch (e) {
    if (e) return res.status(500).send(`Method name: GET, Args: Nothing. There was a problem finding the groups. Message ${e}`);
  }
});

router.post('/add', validateSchema(), async function (req, res) {
  const groupData = {
    id: req.body.id,
    name: req.body.name,
    permission: req.body.permission,
  };
  try {
    const group = await Group.create(groupData);
    res.status(200).send(group);
  } catch (e) {
    if (e) return res.status(500).send(`Method name: GET, Args: GroupData. There was a problem adding the information to the database. Message ${e}`);
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
    const group = await Group.findByPk(id);
    res.status(200).send(group);
  } catch (e) {
    if (e) return res.status(500).send(`Method name: GET, Args: GroupId. There was a problem finding the group. Message ${e}`);
  }
});

router.put("/:id", validateSchema(), async function (req, res) {
  try {
    await Group.update(req.body, {
      where: {
        id: req.params.id
      }
    });
    res.status(200).send(`Successfully updated group with id = ${req.params.id}`);
  } catch (e) {
    if (e) return res.status(500).send(`Method name: PUT, Args: GroupId. There was a problem update the group. Message ${e}`);
  }
});

router.delete("/:id", async function (req, res) {
  try {
    await Group.destroy({
      where: {
        id: req.params.id
      }
    });
    res.status(200).send(`Successfully deleted group with id = ${req.params.id}`);
  } catch (e) {
    if (e) return res.status(500).send(`Method name: DELETE, Args: UserId. There was a problem delete group. Message ${e}`);
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