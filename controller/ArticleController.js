const model = require('../models/index');
const Article = model.articles;
const User = model.users;
const Like = model.likes;
const Comment = model.comments;
const jwt = require('jsonwebtoken');

const index = async (req, res) => {
    try{
        let user;
        if (token = req.headers.authorization) {
            user = jwt.verify(token, process.env.JWT_KEY);    
            console.log(user);
        }
        const [results, metadata] = await model.sequelize.query(`
            select 
                articles.*, 
                users.id as user_id,
                users.name as user_name,
                case when likes.userId is not null then true else false end as is_liked
            from articles
            left join users on articles.userId = users.id
            left join likes on articles.id = likes.articleId and likes.userId = '${user?.id}'
        `);

        let articles = [];
        results.forEach((result) => {
            articles.push({
                'id': result['id'],
                'title': result['title'],
                'body': result['body'],
                'createdAt': result['createdAt'],
                'updatedAt': result['updatedAt'],
                'author': {
                    'id': result['user_id'],
                    'name': result['user_name'],
                },
                'isLiked': result['is_liked'],
            });
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
            ],
            order: [[Comment, 'createdAt', 'ASC']],
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

            // await article.reload({
            //     include: {
            //         model: User,
            //         through: Like
            //     }
            // });
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