const { sequelize, Sequelize } = require(".");

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING(255),
            allowNull: false,
        },
        email: {
            type: Sequelize.STRING(255),
            unique: true,
            allowNull: false,
            validate: {
                is: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            },
        },
        password: {
            type: Sequelize.STRING(255),
            allowNull: false,
        },
    });
    return User;
}