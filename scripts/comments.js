(function(window) {
  "use strict";

  var App = window.App || {};
  var $ = window.jQuery;

  function Comments(selector) {
    if (!selector) {
      throw new Error("No selector provided");
    }

    this.$element = $(selector);
    if (this.$element.length === 0) {
      throw new Error("Could not find element with selector: " + selector);
    }
  }

  Comments.prototype.addRow = function(bandComment) {
    console.log("Calling Comments.addRow()");
    //this.removeRow(coffeeOrder.emailAddress);
    var rowElement = new Row(bandComment);
    this.$element.append(rowElement.$element);
  };

  Comments.prototype.removeRow = function(email) {
    console.log("Calling Comments.removeRow()");
    this.$element
      .find("[value=\"" + email + "\"]")
      .closest("[data-coffee-order=\"checkbox\"]")
      .remove();
  };

  function Row(bandComment) {
    var $div = $("<div></div>", {
      "data-band-review": "user-comments",
      "class": "checkbox"
    });

    var $label = $("<label></label>");
    var thumbIcon = "";
    if(bandComment.vote === "upvote"){
      thumbIcon = "&#xe125;";
    } else{
      thumbIcon = "&#xe126;";
    }

    var description = "<div class=\"comment-img\"> <img src=\"images/user.jpg\"  width=\"50\" height=\"50\" /> </div>"
    description += "<div class=\"comment-body\"> <div class=\"text\"> <span class=\"glyphicon\">" + thumbIcon +"</span>"+"<font color=\"gray\"> <i> \"" + bandComment.comment + "\"</i></font> </div>";
    description += "<p class=\"attribution\"><b>by " + bandComment.username + "<b> at ";
    description += "<font class=\"attribution\">" + bandComment.postDate + "</font><br/>";
    description += "<hr>";

    /*var description = "<p><b>" + bandComment.username + ":<br/><b>";
    description += "<small><font color=\"gray\">-" + bandComment.postDate + "</font></small><br/>";
    description += "<span class=\"glyphicon\">" + thumbIcon +"</span>"+"<font color=\"gray\"> <i> \"" + bandComment.comment + "\"</i></font><br/><br/>";*/

    $label.append(description);
    $div.append($label);

    this.$element = $div;
  }

  App.Comments = Comments;
  window.App = App;
})(window);
