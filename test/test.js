var assert = require("assert");

// TODO add tests

var mongoose = require("mongoose");
var User = require('../models/user');
mongoose.connect('mongodb://localhost/jchat');


describe('User', function(){
  describe('#save()', function(){
    it('should save without error', function(done){
      var user = new User({ username: "test", email: "test@test.com" });
      user.password = user.generateHash("1234")
      user.save(done);
    })
  })

  describe('#remove()', function(){
    it('should remove without error', function(done){
      user = User.findOne({ username: "test" });
      user.remove(done);
    })
  })
})
