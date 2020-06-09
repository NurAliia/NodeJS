const express = require("express");
const cors = require("cors")
const router = express.Router();
const bodyParser = require("body-parser");
const { User, Group } = require("../db.js");
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(cors());

router.get("/", async function (req, res) {
  res.set({
    "Access-Control-Allow-Origin" : "*",
    "Access-Control-Allow-Credentials" : true,
    "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTION",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token"
  });
  debugger;
  let answer = "";
  User.findAll({
    attributes: ["login"], // включаем столбец name из таблицы users
    include: [{
      model: Group,
      attributes: ["name"]  // включаем столбец name из таблицы groups
    }]
  }).then(users => {
    for(user of users){
      answer += `${user.dataValues.login} - ${user.dataValues.Groups && user.dataValues.Groups.name || 'NO'}\n`;
    }
    res.status(200).send(answer);
  });
});

router.get("/getGroups/:id", async function (req, res) {
  res.set({
    "Access-Control-Allow-Origin" : "*",
    "Access-Control-Allow-Credentials" : true,
    "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTION",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token"
  });
  const userId = req.params.id;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const groups = user.getGroup();
    res.status(200).send(groups);
  } catch (e) {
    if (e) return res.status(500).send(`There was a problem finding the groups of current user. Message ${e}`);
  }
});

router.get("/getUsers/:id", async function (req, res) {
  res.set({
    "Access-Control-Allow-Origin" : "*",
    "Access-Control-Allow-Credentials" : true,
    "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTION",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token"
  });
  const groupId = req.params.id;
  try {
    const group = await User.findByPk(groupId);
    if (!group) {
      throw new Error("Group not found");
    }
    const users = group.getUser();
    res.status(200).send(users);
  } catch (e) {
    if (e) return res.status(500).send(`There was a problem finding the users of current group. Message ${e}`);
  }
});


router.post("/add", async function (req, res) {
  const userId = req.headers.userid;
  const groupId = req.headers.groupid;
  User.findOne({where: {id: userId}})
    .then(user=>{
      if(!user) return;

      // добавим Тому курс по JavaScript
      Group.findOne({where: {id: groupId}})
        .then(group=>{
          if(!group) return;
          user.addGroup(group);
        });
    });
  // try {
  //   const user = await User.create({ userId });
  //   const group = await Group.create({ groupId });
  //   user.setGroup(group);
  //   res.status(200).send("Successful");
  // } catch (e) {
  //   if (e) return res.status(500).send(`There was a problem finding the users-group. Message ${e}`);
  // }
});

router.delete("/delete", async function (req, res) {
  const userId = req.headers.userId;
  User.findOne({where: {id: userId}})
    .then(user=>{
      if(!user) return;
      user.getGroups().then(group => {
        for(group of groups){
          if(group.name==="JavaScript") group.usergroup.destroy();
        }
      });
    });
});


module.exports = router;