/*
 * main.js
 */

$(function() {

  
  // socket.io
  
  var socket = io.connect();

  socket.on('new user', function (username) {
      addUser(username);
  });
  

  socket.on('user left', function (username) {
      removeUser(username);
  });
  

  socket.on('new message', function (data) {
      addMessage(data);
  });
  

  socket.on('online users', function (data) {
      for (i=0; i<data.length; i++) {
	addUser(data[i]);
      }
  });
  

  socket.on('logged out', function (data) {
      window.location.href = "/logout";
  });
  

  // UI listeners
  
  // when document is ready
  $(document).ready(function() {
    // fade out any flash-messages
    $(".flashMessage").fadeOut(3000);
  });

  
  // user sends a message
  $('#messagesInput').keydown(function (event) {
    if (event.which === 13) {
      var message = $('#messagesInput').val().trim();
      if (message) socket.emit('new message', message);
      $('#messagesInput').removeAttr('placeholder').val("");
    }
  });


  // UI helpers
  
  // add new user
  function addUser(username) {
    var element = $('<li>').attr('id', username).text(username);
    $('#usersList').append(element);
    element.hide().fadeIn(500);
  }
  
  
  // remove user
  function removeUser(username) {
    $('#' + username).remove();
  }

  
  // display new message
  function addMessage(data) {
    var element = $(
      '<li><span class="username">' + data.username + '</span>\
      <span class="message">' + data.message + '</span></li>'
    );
    $('#messagesList').append(element);

    // scroll to last message
    $('#messagesList')[0].scrollTop = $('#messagesList')[0].scrollHeight;

    element.hide().fadeIn(500);
  }
  
});
