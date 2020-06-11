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
