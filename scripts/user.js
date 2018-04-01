(function(window) {
  "use strict";
  var App = window.App || {};
  //var $ = window.jQuery;

  function User(db) {
    this.db = db;
  }

  User.prototype.authenticate = function(data,cb) {
    this.db.getByKey("username", data.username, function(serverResponse) {
      if (serverResponse.length != 0) {
        if(data.username == serverResponse[0].username && data.password == serverResponse[0].password){
          cb("success");
        } else{
          cb("error");
        }
      } else{
        cb("signup");
      }
    });
  };

  User.prototype.register = function(user){
    this.db.add(user.username,user);
  }

  App.User = User;
  window.App = App;

})(window);
