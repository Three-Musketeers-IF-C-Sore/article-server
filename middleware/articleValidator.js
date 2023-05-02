const { check, validationResult } = require('express-validator');

exports.validateArticle = [
    check('title')
        .notEmpty()
        .withMessage('Title is required').bail(),
    check('body')
        .notEmpty()
        .withMessage('Content is required').bail(),
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        next();
    },
]
