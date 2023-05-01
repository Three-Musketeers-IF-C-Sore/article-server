const { sequelize, Sequelize } = require(".");

module.exports = (sequelize, Sequelize) => {
    const Like = sequelize.define("like");
    return Like;
}