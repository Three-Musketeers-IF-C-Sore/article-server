const model = require('../models/index');
const Article = model.articles;
const User = model.users;
const Like = model.likes;
const Comment = model.comments;

const index = async (req, res) => {
    try{
        const articles = await Article.findAll({
            attributes: { exclude: ['userId'] },
            include: [
                {
                    model: User,
                    attributes: { exclude: ['password'] },
                    as: "author",
                },
                {
                    model: Comment,
                    attributes: { exclude: ['articleId', 'userId'] },
                    include: {
                        model: User,
                        attributes: { exclude:['password'] },
                        as: "user",
                    },
                },
                {
                    association: 'likes',
                    through: {
                        attributes: []
                    },
                    attributes: { exclude: ['password'] },
                }
            ],
            order: [[Comment, 'createdAt', 'ASC']],
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

const storeComment = async (req, res) => {
    try{
        const { text } = req.body;

        const comment = await Comment.create({
            text: text,
            userId: req.user.id,
            articleId: req.params.id,
        });

        return res.status(200).json({
            data: comment,
        });
    } catch(err) {
        return res.status(500).end();
    }
}

const destroyComment = async (req, res) => {
    try{
        const comment = await Comment.findOne({
            where: {
                userId: req.user.id,
                id: req.params.id,
            }
        });

        if(!comment) {
            return res.status(404).json({
                message: "Comment Not Found"
            })
        }

        if(req.user.id == comment.articleId) return res.status(401).json({ message: "Unauthorized" });

        comment.destroy();
        return res.status(200).json({
            message: "The comment was successfully deleted!"
        });

    } catch(err) {
        return res.status(500).end()
    }
}

module.exports = { index, show, like, storeComment, destroyComment };