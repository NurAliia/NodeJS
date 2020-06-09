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

module.exports = User;
