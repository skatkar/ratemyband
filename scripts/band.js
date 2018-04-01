(function(window) {
  "use strict";
  var App = window.App || {};
  var $ = window.jQuery;

  function Band(db) {
    this.db = db;
  }

  Band.prototype.getBandInfo = function(bandName, cb) {
    this.db.getByKey("bandName", bandName, function(serverResponse) {
      if (serverResponse.length != 0) {
        cb(serverResponse[0]);
      }
    });
  }

  Band.prototype.saveComment = function(order) {
    this.db.add(order.emailAddress, order);
  };


  Band.prototype.getAllBands = function(cb) {
    this.db.getAll(function(serverResponse) {
      if (serverResponse.length != 0) {
        cb(serverResponse);
      }
    });
  }

  Band.prototype.displayAllBands = function(bandInfoList, selector) {
    if (!selector) {
      throw new Error("No selector provided");
    }
    this.bandInfoList = bandInfoList;
    this.$element = $(selector);
    if (this.$element.length === 0) {
      throw new Error("Could not find element with selector: " + selector);
    }

    var genrelist = getUniqueGenres(this.bandInfoList);

    $.each(genrelist, function(i, genre) {
      console.log("The genre name is :" + genre);
      var $div = $("<div></div>", {
        "data-band-left": "genre",
      });

      var $thumbnailDiv = $("<div></div>", {
        "class": "panel panel-footer"
      });

      var $header = $("<header></header");
      $header.append(genre);

      var $ul = $("<ul></ul>", {
        "class": "thumbnail-list"
      });

      var rowElement = thumbnailRow(this.bandInfoList,genre,$thumbnailDiv)
      $ul.append(rowElement);

      $div.append($header);
      $div.append($ul);

      this.$element.append($div);

    }.bind(this));
  };

  Band.prototype.displayComments = function(bandName, cb) {
    /*this.db.getAll(function(serverResponse) {
      console.log(serverResponse);
      cb(serverResponse);
    });*/
    this.db.getByKey("bandName", bandName, function(serverResponse) {
      if (serverResponse.length != 0) {
        console.log("The list of comments is :" + serverResponse);
        cb(serverResponse);
      }
    });
  };

  function getUniqueGenres(bandInfoList){
    var lookup = {};
    var items = bandInfoList;
    var genrelist = [];

    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var genre = item.genre;

      if (!(genre in lookup)) {
        lookup[genre] = 1;
        genrelist.push(genre);
      }
    }

    return genrelist;
  }

  function thumbnailRow(bandInfoList,genre,$thumbnailDiv){

    $.each(bandInfoList, function(i, bandInfo) {
      if (genre == bandInfo.genre) {
        var $li = $("<li></li>", {
          "class": "thumbnail-item"
        });

        var $a = $("<a></a>", {
          "href": bandInfo.bandImage,
          "data-image-role": "trigger",
          "data-image-title": bandInfo.bandName,
          "data-image-url": bandInfo.bandImage
        });

        var $img = $("<img>", {
          "class": "thumbnail-image",
          "src": bandInfo.bandImage,
        });

        var $span = $("<span></span>", {
          "class": "thumbnail-title"
        });
        $span.append(bandInfo.bandName);

        $a.append($img);
        $a.append($span);

        $li.append($a);
        $thumbnailDiv.append($li);
      }
    });

    return $thumbnailDiv;
  }

  App.Band = Band;
  window.App = App;

})(window);
