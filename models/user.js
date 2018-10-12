const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

//hash the password before 'saving'
userSchema.pre('save', function (next) {
  let user = this;
  bcrypt.hash(user.password, 10, function (error, hash) {
    if (error) return next(error);
    user.password = hash;
    next();
  });
});

const User = mongoose.model('user', userSchema);

module.exports = User;
