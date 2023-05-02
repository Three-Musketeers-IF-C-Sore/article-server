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

module.exports = { index, store };