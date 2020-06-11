const express = require("express");
const cors = require("cors")
const router = express.Router();
const bodyParser = require("body-parser");
const { User, Group } = require("../db.js");
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(cors());

router.get("/", VerifyToken, async function (req, res) {
  res.set({
    "Access-Control-Allow-Origin" : "*",
    "Access-Control-Allow-Credentials" : true,
    "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTION",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token"
  });
  let answer = "";
  try {
    const users = await User.findAll({
      attributes: ["login"], // включаем столбец name из таблицы users
      include: [{
        model: Group,
        attributes: ["name"]  // включаем столбец name из таблицы groups
      }]
    });
    for(user of users) {
      for (group of user.dataValues.Groups) {
        answer += `${user.dataValues.login} - ${group.dataValues.name || 'NO'}\n`;
      }
    }
    res.status(200).send(answer);
  } catch (e) {
    if (e) return res.status(500).send(`Method name: GET, Args: Nothing. There was a problem finding the users and groups. Message ${e}`);
  }
});

router.get("/getGroups/:id", VerifyToken, async function (req, res) {
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
    if (e) return res.status(500).send(`Method name: GET, Args: UserId. There was a problem finding the groups of current user. Message ${e}`);
  }
});

router.get("/getUsers/:id", VerifyToken, async function (req, res) {
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
    if (e) return res.status(500).send(`Method name: GET, Args: GroupId. There was a problem finding the users of current group. Message ${e}`);
  }
});

router.post("/add", VerifyToken, async function (req, res) {
  const userId = req.headers.userid;
  const groupId = req.headers.groupid;
  try {
    const user = await User.findByPk(userId);
    if(!user) throw new Error("User not found");
    const group = await Group.findByPk(groupId);
    if(!group) throw new Error("Group not found");
    user.addGroup(group);
    res.status(200).send(`Successful added userId = ${userId} and groupId = ${groupId}`);
  } catch (e) {
    if (e) return res.status(500).send(`Method name: POST, Args: UserId, GroupId. There was a problem finding the users-group. Message ${e}`);
  }
});

router.delete("/deleteGroup", VerifyToken, async function (req, res) {
  const userId = req.headers.userid;
  const groupName = req.headers.groupname;
  const user = await User.findByPk(userId);
  try {
    if(!user) throw new Error("User not found");
    const groups = await user.getGroups();
    for(group of groups) {
      if (groupName) {
        if (group.dataValues.name === groupName) {
          group.dataValues.UserGroup.destroy();
          res.status(200).send(`Successful deleted userId = ${userId} and groupName = ${groupName}`);
        }
      } else {
        group.dataValues.UserGroup.destroy();
      }
    }
    res.status(200).send(`Successful deleted groups of userId = ${userId}`);
  } catch (e) {
    if (e) return res.status(500).send(`Method name: Delete, Args: UserId, GroupName. There was a problem delete group. Message ${e}`);
  }

});

router.delete("/deleteUser", VerifyToken, async function (req, res) {
  const groupId = req.headers.groupid;
  const userLogin = req.headers.userlogin;
  const group = await Group.findByPk(groupId);
  try {
    if(!group) throw new Error("Group not found");
    const users = await group.getUsers();
    for(user of users) {
      if (userlogin) {
        if (user.dataValues.login === userlogin) {
          user.dataValues.UserGroup.destroy();
          res.status(200).send(`Successful deleted groupId = ${groupId} and userLogin = ${userLogin}`);
        }
      } else {
        user.dataValues.UserGroup.destroy();
      }
    }
    res.status(200).send(`Successful deleted users of groupId = ${groupId}`);
  } catch (e) {
    if (e) return res.status(500).send(`Method name: DELETE, Args: GroupId, UserId. There was a problem finding delete user. Message ${e}`);
  }
});


module.exports = router;