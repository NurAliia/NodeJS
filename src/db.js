const Sequelize = require('sequelize');

const sequelize = new Sequelize("nodemysql", "root", "", {
    host: 'localhost',
    dialect: "mysql",
    connectionLimit: 10,
});

const User = sequelize.define('User', {
    // Model attributes are defined here
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    login: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    age: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    isDeleted: {
        type: Sequelize.BOOLEAN,
        default: false
    }
}, {
    timestamps: false
});

const Group = sequelize.define('Group', {
    // Model attributes are defined here
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    permission: {
        type: Sequelize.STRING,
        allowNull: false
    },
}, {
    timestamps: false
});

const UserGroup = sequelize.define('UserGroup', {
    // Model attributes are defined here
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
}, {
    timestamps: false
});

User.belongsToMany(Group, {through: UserGroup});
Group.belongsToMany(User, {through: UserGroup});

sequelize.sync({force:true}).then(()=>{

    console.log("Tables have been created");
}).catch(err=>console.log(err));

module.exports = {
    User,
    Group,
    UserGroup
};

// var sql = "CREATE TABLE USERS (id VARCHAR(255), login VARCHAR(255), password VARCHAR(255), age INT, isDeleted BOOLEAN)";
// db.query(sql, function (err, result) {
//     if (err) console.log(err);
//     console.log("Table created");
// });
// var sql = "CREATE TABLE GROUPS (id VARCHAR(255), name VARCHAR(255), permission VARCHAR(255))";
// db.query(sql, function (err, result) {
//     if (err) console.log(err);
//     console.log("Table created");
// });
//
// var sql = "CREATE TABLE USERSGROUP (groupId VARCHAR(255), userId VARCHAR(255))";
// db.query(sql, function (err, result) {
//     if (err) console.log(err);
//     console.log("Table created");
// });

// {
//     "id": "1",
//   "login": "log",
//   "password": "123erw",
//   "age": 23,
//   "isDeleted": false
// }
