const model = require('../models/index');
const Article = model.articles;
const User = model.users;

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