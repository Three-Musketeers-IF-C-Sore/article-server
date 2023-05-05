const model = require('../models/index');
const User = model.users;
const Article = model.articles;
const Like = model.likes;

const index = async (req, res) => {
    const articles = await Article.findAll({
        include: {
            model: User,
            where: { id: req.user.id },
            attributes: { exclude: ['password'] },
            through: Like,
        },
        attributes: { exclude: ['userId'] },
    });

    return res.status(200).json({
        data: articles,
    })
}

const store = async (req, res) => {
    const article = await Article.findOne({
        where: {
            id: req.params.id,
        }
    })

    if(!article) return res.status(404).end();

    const like = await Like.findOne({
        where: {
            userId: req.user.id,
            articleId: article.id
        }
    });

    if(like){
        await like.destroy();
        return res.status(200).json({
            message: "Like removed."
        });
    } else {
        await Like.create({
            userId: req.user.id,
            articleId: article.id,
        });

        await article.reload({
            include: {
                model: User,
                through: Like
            }
        });

        return res.status(200).json({
            message: "Article liked."
        });
    }
}

module.exports = { index, store };