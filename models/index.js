const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user.model.js")(sequelize, Sequelize);
db.articles = require("./article.model.js")(sequelize, Sequelize);
db.likes = require("./like.model.js")(sequelize, Sequelize);
db.comments = require("./comment.model.js")(sequelize, Sequelize);

db.users.hasMany(db.articles, {
    as: "articles",
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
db.articles.belongsTo(db.users, {
    foreignKey: "userId",
    as: "user",
});

db.users.belongsToMany(db.articles, {
    through: db.likes,
});

db.articles.belongsToMany(db.users, {
    through: db.likes,
});

db.users.hasMany(db.comments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
db.comments.belongsTo(db.users);

db.articles.hasMany(db.comments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
db.comments.belongsTo(db.articles);

module.exports = db;