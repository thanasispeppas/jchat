// User model

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    validate: [ /^[a-zA-Z0-9_-]{1,20}$/, "Invalid username" ]
  },
  email: {
    type: String,
    required: true,
    validate: [ /^[a-zA-Z0-9._-]+@[a-zA-Z0-9_-]+\.[a-zA-Z]{2,3}$/,
      "Invalid email" ]
  },
  password: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    validate: [ /^.{1000}$/, "Description too long, maximum 1000 chars" ]
  },
  created: {
    type: Date,
    default: Date.now,
    required: true
  },
  updated: {
    type: Date,
    default: Date.now,
    required: true
  },
  suspended: {
    type: Boolean,
    default: false
  }
});

// create password hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// compare password
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
