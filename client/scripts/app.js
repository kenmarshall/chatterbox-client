// YOUR CODE HERE:
var app = {};


app.init = function(){
  // html elements
  app.$chats = $('#chats');
  app.$username = $('.username');
  app.$text = $('.text');
  app.$chatTemplate = $('#chatTemplate');
  app.$roomNameSelections = $('#roomNameSelections');



  app.messages = [];
  app.roomNameLists = ['Lobby' , '4Chan'];
  app.currentRoomname = 'All';
  app.currentUsername = window.location.search.split('=')[1];

};

app.updateRoomSelectionList = function() {
  app.$roomNameSelections.html('');
  app.roomNameLists.forEach(function(roomname){
    app.$roomNameSelections.append('<li><a>' + roomname + '</a></li>');
  });
  app.$roomNameSelections.append('<li><a>All</a></li>');
}



app.send = function (msg, cb) {



  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages',
    type: 'POST',
    data: JSON.stringify(msg),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent', data);
      cb('success');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      cb('fail');
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = function (roomName) {

  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages',
    type: 'GET',
    data : {order: '-createdAt'},
    contentType: 'application/json',
    success: function (data) {
      if (!data.results) {
        return;
      }

      app.messages = data.results;
      app.clearMessages();
      app.messages.forEach(app.renderMessage);
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.clearMessages = function () {
  app.$chats.html('');
}

app.renderMessage = function (message) {
  var $msg = app.$chatTemplate.clone(true);
  $msg.find('.username #usernameLink').text(message.username);
  $msg.find('.text').text(message.text);
  $('#chats').append($msg);
}

app.filterMessagesByRoom = function () {
 var filteredmsgs = app.messages.filter(function(message){
    if (message.roomname === app.currentRoomname.toLowerCase()){
        return true;
    }
  });

  console.log(filteredmsgs);

  if (filteredmsgs.length) {
    app.clearMessages();
    filteredmsgs.forEach(app.renderMessage);
  } else {
    app.fetch();
  }


}

app.filterMessagesByUsername = function (username) {
 var filteredmsgs = app.messages.filter(function(message){
    if (message.username === username){
        return true;
    }
  });



  if (filteredmsgs.length) {
    app.clearMessages();
    filteredmsgs.forEach(app.renderMessage);
  } else {
    app.fetch();
  }


}




  // ======================= click handlers ===================================
$(document).ready(function(){
  app.init();
  app.updateRoomSelectionList();
  app.fetch();

  $('#refreshMessages').on('click', function(event) {
    app.fetch();
  });

  $('#sendMessage').submit(function(event){
   // var msg = $()$('#message').val());
   if ($('#messageText').val().length ) {
      var msg  = {};

      msg.username = app.currentUsername;
      msg.text = $('<div></div>').text($('#messageText').val()).text();
      msg.roomname = app.currentRoomname;
      app.send(msg, function(status){
        if (status === 'success') {
          app.fetch();
        }
      });
    }

    event.preventDefault();
  });

  $('#roomNameSelections li').on('click', function(){
    app.currentRoomname = $(this).text().toLowerCase() === 'All' ? app.roomNameLists[0].toLowerCase() : $(this).text().toLowerCase();
    $('#roomNameIndicator').html($(this).text() + ' <span class="caret"></span>');
    if (app.currentRoomname === 'All') {
      app.fetch();
    } else {
      app.filterMessagesByRoom();
    }

  });

  $('#usernameLink').on('click', function(event){

    app.filterMessagesByUsername($(this).text());
  });



});










/*

*/