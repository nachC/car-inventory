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
    // search in the collection for a user with this username
    User.findOne({ username: req.body.username })
      .then(user => {
        if (user) {
          let err = new Error('Username already exists');
          err.status = 400;
          return next(err);
        } else {
          const newUser = new User({
            username: req.body.username,
            password: req.body.password
          });

          User.create(newUser, (err, user) => {
            if (err) {
              return next(err);
            } else {
              // if created successfully respond with the username and redirect path
              return res.status(200).json({
                redirect: 'login',
                username: newUser.username
              });
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
          // if username doesn't exists pass error to next()
          let err = new Error('Incorrect username');
          err.status = 401;
          return next(err);
        }

        bcrypt.compare(password, user.password)
          .then(matched => {
            if (!matched) {
              // if password doesn't match pass error to next()
              let err = new Error('Incorrect password');
              err.status = 401;
              return next(err);
            }
            req.session.id = user.id;
            // on successfull login return json with username
            res.status(200).json({
              redirect: 'home',
              username: user.username
            });
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
    res.status(200).json({
      redirect: 'login'
    });
  });


module.exports = userRouter;