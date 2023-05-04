const model = require('../models/index');
const User = model.users;
const Article = model.articles;

const index = async (req, res) => {
    const articles = await Article.findAll({
        where: {
            userId: req.user.id
        },
        attributes: { exclude: ['userId'] },
        include: {
            model: User,
            attributes: { exclude: ['password'] },
            as: "user",
        }
    })

    return res.status(200).json({
        data: articles,
    })
}

module.exports = { index };