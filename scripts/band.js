(function(window) {
  "use strict";
  var App = window.App || {};

  function Band(db) {
    this.db = db;
  }

  /*Band.prototype.getBandVideo = function(bandName,cb){
    this.db.getByKey(bandName,function(serverResponse){
      if(serverResponse.length != 0){
        console.log("The band video is :" + serverResponse[0].bandVideo);
        cb(serverResponse[0].bandVideo);
      }
    });
  }*/

  Band.prototype.getBandInfo = function(bandName,cb){
    this.db.getByKey(bandName,function(serverResponse){
      if(serverResponse.length != 0){
        cb(serverResponse[0]);
      }
    });
  }

  Band.prototype.saveComment = function(order) {
    this.db.add(order.emailAddress, order);
  };

  Band.prototype.displayComments = function(bandName,cb) {
    /*this.db.getAll(function(serverResponse) {
      console.log(serverResponse);
      cb(serverResponse);
    });*/
    this.db.getByKey(bandName,function(serverResponse){
      if(serverResponse.length != 0){
        console.log("The list of comments is :" + serverResponse);
        cb(serverResponse);
      }
    });
  };

  App.Band = Band;
  window.App = App;

})(window);
