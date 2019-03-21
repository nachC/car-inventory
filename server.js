require('dotenv').config();
const express = require('express');
const createError = require('http-errors');
const mongoose = require('mongoose');
const sessions = require("client-sessions");

const userRouter = require('./routes/userRouter');
const carRouter = require('./routes/carRouter');

const User = require('./models/user');

const port = process.env.PORT || 3000;

/* DATABASE CONECTION */
const connect = mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
connect.then(() => {
  db = mongoose.connection;
  console.log('Connected correctly to db');
}, (err) => { next(err); });
/* END DATABASE CONNECTION*/

const app = express();

/* MIDDLEWARE */
app.use(express.json());

//SESSION MIDDLEWARE
app.use(sessions({
  cookieName: 'session',
  secret: process.env.COOKIES_SECRET,
  duration: 60 * 60 * 1000
}));

app.use((req, res, next) => {
  if (!(req.session && req.session.id)) {
    return next();
  }
  User.findById(req.session.id).select({ password: 0 }).exec((err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next();
    }
    req.user = user;
    next();
  });
});

/* ROUTES */
app.use('/users', userRouter);
app.use('/cars', carRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.send(err.message);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});