const model = require('../models/index');
const Article = model.articles;
const User = model.users;
const Like = model.likes;

const index = async (req, res) => {
    try{
        const articles = await Article.findAll({
            attributes: { exclude: ['userId'] },
            include: {
                model: User,
                attributes: { exclude: ['password'] },
                as: "user",
            }
        });
        return res.status(200).json({
            data: articles,
        });
    } catch (err) {
        return res.status(500).end();
    }
}

const show = async (req, res) => {
    try {
        const article = await Article.findOne({
            where: {
                id: req.params.id,
            },
            attributes: { exclude: ['userId'] },
            include: {
                model: User,
                attributes: { exclude: ['password'] },
                as: "user",
            }
        })
        return res.status(200).json({
            data: article,
        })
    } catch (err) {
        return res.status(500).end();
    }
}

const like = async (req, res) => {
    const { isLiked } = req.body;

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

    if(isLiked) {
        if(!like) {
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
        }
        return res.status(200).json({
            message: "Article liked"
        })

    } else {
        if(like) {
            await like.destroy();
        }
        return res.status(200).json({
            message: "Like removed."
        });
    }
}

module.exports = { index, show, like };