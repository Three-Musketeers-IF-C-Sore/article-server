const { check, validationResult } = require('express-validator');
const model = require("../models/index");

exports.validateUser = [
  check('name')
    .notEmpty()
    .withMessage('Name is required').bail()
    .isLength({ min: 3, max: 255 })
    .withMessage('Name must have a minimum length of 3').bail()
    .isAlpha('en-US', {ignore: '\s'})
    .withMessage('Name should only contain letters').bail(),
  check('email')
    .notEmpty()
    .withMessage('Email is required').bail()
    .isEmail()
    .withMessage('Email is Invalid').bail()
    .custom(value => {
      return model.users.findOne({ where: { email: value } })
        .then((user) => {
          if (user)
            return Promise.reject('Email already exists')
        })
    }),
  check('password')
    .notEmpty()
    .withMessage('Password is required').bail()
    .isLength({ min: 8, max: 255 })
    .withMessage('Password must have a minimum length of 8').bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
]