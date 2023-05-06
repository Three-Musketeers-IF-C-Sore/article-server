const model = require('../models/index');
const User = model.users;
const Article = model.articles;
const Like = model.likes;

const index = async (req, res) => {
    if(req.query.favorite == "true") {
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
            include: {
                model: User,
                attributes: { exclude: ['password'] },
                as: "author",
            }
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