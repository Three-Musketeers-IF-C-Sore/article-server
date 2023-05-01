const { sequelize, Sequelize } = require(".");

module.exports = (sequelize, Sequelize) => {
    const Article = sequelize.define("article", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: Sequelize.STRING(255),
            allowNull: false,
        },
        body: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
    });
    return Article;
}