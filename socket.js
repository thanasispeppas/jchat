/*
 * socket.js
 */

var Message = require('./models/message');

module.exports = function(io) {

  var userSockets = [];

  // onlineUsers returns the unique values of userSockets
  function onlineUsers() {
    var n = []; 
    for (i = 0; i < userSockets.length; i++) {
      if (n.indexOf(userSockets[i]) == -1) n.push(userSockets[i]);
    }
    return n;
  };
  
  
  io.on('connection', function(socket) {
    //console.log(socket.request);
    var username = socket.request.user.username;
    console.log("io: socket connected, username: " + username);
    // notify all if this is a new user
    if (onlineUsers().indexOf(username) == -1) {
      socket.broadcast.emit('new user', username);
    }
    userSockets.push(username);
    socket.emit("online users", onlineUsers());

    
    // new message received
    socket.on('new message', function (message) {
      console.log("io: new message, username: " + username);
      // broadcast to all
      io.sockets.emit('new message', {
	username: username, message: message
      });
      // save the message
      //console.log("Saving new message...");
      var newMessage = new Message({
	user: socket.request.user._id, text: message
      });
      newMessage.save(function(err) {
	if (err) {
	  console.log(err); 
	} else {
	  console.log("New message saved.");
	}
      });
    });


    // socket disconnected
    socket.on('disconnect', function(){
      console.log("io: socket disconnected, username: " + username);
      userSockets.splice(userSockets.indexOf(username), 1);
      // if user has no more sockets notify that user left
      if (onlineUsers().indexOf(username) == -1) {
	socket.broadcast.emit('user left', username);
      }
    });
  });
  
};
