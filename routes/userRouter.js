const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const validator = require('../validator');
const userRouter = express.Router();

/*
 REGISTER users/register
  Public
*/
userRouter.route('/register')
  .post(validator.validateInput, (req, res, next) => {
    User.findOne({ username: req.body.username })
      .then(user => {
        if (user) {
          let err = new Error('Username already exists');
          err.status = 400;
          return res.json({ error: err.status, message: err.message });
        } else {
          const newUser = new User({
            username: req.body.username,
            password: req.body.password
          });

          User.create(newUser, (err, user) => {
            if (err) {
              return next(err);
            } else {
              return res.status(200).end('redirect to login');
            }
          });
        }
      })
      .catch(err => next(err));
  });

/*
 LOGIN users/login
  Public - sets cookie
*/
userRouter.route('/login')
  .post(validator.validateInput, (req, res, next) => {

    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ username })
      .then(user => {
        if (!user) {
          let err = new Error('Incorrect username');
          err.status = 404;
          return res.json({ error: err.status, message: err.message });
        }

        bcrypt.compare(password, user.password)
          .then(matched => {
            if (!matched) {
              let err = new Error('Incorrect password');
              err.status = 404;
              return res.json({ error: err.status, message: err.message });
            }
            req.session.id = user.id;
            res.status(200).end('Logged in - redirect to main page');
          })
          .catch(err => next(err));
      })
      .catch(err => next(err));
  });

/*
 LOGOUT users/logout
*/
userRouter.route('/logout')
  .get((req, res, next) => {
    req.session.reset();
    res.status(200).end('redirect to main page');
  });


module.exports = userRouter;