const model = require('../models/index');
const User = model.users;
const Article = model.articles;
const Like = model.likes;
const Comment = model.comments;
const jwt = require("jsonwebtoken");

const index = async (req, res) => {
    if(req.query.favorite == "true") {
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
            having is_liked = 1
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
    } else {
        const articles = await Article.findAll({
            where: {
                userId: req.user.id
            },
            attributes: { exclude: ['userId'] },
            include: {
                model: User,
                attributes: { exclude: ['password'] },
                as: "author",
            }
        })
    
        return res.status(200).json({
            data: articles,
        })
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

const store = async (req, res) => {
    try {
        const { title, body } = req.body;
        const article = await Article.create({
            title: title,
            body: body,
            userId: req.user.id,
        });  

        return res.status(201).json({
            message: "The article was successfully posted!", 
            data: article,
        })

    } catch (err) {
        return res.status(500).end();
    }
}

const update = async (req, res) => {
    try{
        const { title, body } = req.body;

        const article = await Article.findOne({ where: { id: req.params.id } });

        if(!article) {
            return res.status(404).json({
                message: "Article Not Found",
            })
        }

        if(req.user.id != article.userId) return res.status(401).json({ message: "Unauthorized" });

        article.title = title;
        article.body = body;
        await article.save();

        res.status(200).json({
            message: "The article was successfully updated!",
            data: article,
        })

    } catch(err) {
        return res.status(500).end()
    }
}

const destroy = async (req, res) => {
    const article = await Article.findOne({
        where: {
            id: req.params.id
        }
    })

    if(!article) {
        return res.status(400).json({
            message: "Article Not Found"
        });
    }

    if(req.user.id != article.userId) return res.status(401).json({ message: "Unauthorized" });

    await Article.destroy({
        where: {
            id: req.params.id
        }
    })

    return res.status(200).json({
        message: "The article was successfully deleted!"
    })
}

module.exports = { index, show, store, update, destroy };