(function(window) {
  "use strict";
  var FORM_SELECTOR_COMMENTS = "[data-band-review=\"form\"]";
  var CHECKLIST_SELECTOR = "[data-band-review=\"user-comments\"]";
  var SERVER_URL_COMMENTS = "http://localhost:2403/user-comments";
  var SERVER_URL_BANDS = "http://localhost:2403/bands";

  var App = window.App;
  var Band = App.Band;
  var RemoteDataStore = App.RemoteDataStore;
  var FormHandler = App.FormHandler;
  var Comments = App.Comments;
  var $ = window.jQuery;

  /*var params = (function() {
    var a;
    return a;
  })();*/
  var params = window.location.search.split("?")[1];
  var bandName = decodeURIComponent(params.split("=")[1]);

  var remoteDSComments = new RemoteDataStore(SERVER_URL_COMMENTS);
  var remoteDSBands = new RemoteDataStore(SERVER_URL_BANDS);

  var myBandComments = new Band(remoteDSComments);
  var bandDetails = new Band(remoteDSBands);

  window.myBandComments = myBandComments;
  window.bandDetails = bandDetails;

  var commentsSummary = new Comments(CHECKLIST_SELECTOR);
  var formHandlerComments = new FormHandler(FORM_SELECTOR_COMMENTS);

  $(document).ready(function() {
    if ($.cookie("username") === null || $.cookie("username") === "" ||
      $.cookie("username") === "null" || $.cookie("username") === undefined) {
      window.location.href = "/";
    } else {
      $("#bandName").text(bandName);
      //$("input[name=\"vote\"]").required = true;
      bandDetails.getBandInfo.call(bandDetails, bandName, function(bandInfo) {
        $("#bandPerformanceDay").text("Performance on " + bandInfo.performanceDay);
        $("#bandVideo").attr("src", bandInfo.bandVideo);
      });
    }

  });

  $(FORM_SELECTOR_COMMENTS).ready(function() {
    //console.log("Page refreshed");

    myBandComments.displayComments.call(myBandComments, bandName, function(comments) {
      var numUpVotes = 0;
      var numDownVotes = 0;
      $.each(comments, function(i, comment) {
        if (comment.vote == "upvote") {
          numUpVotes++;
        } else {
          numDownVotes++;
        }
        commentsSummary.addRow.call(commentsSummary, comment);
      });
      console.log("Total up votes : " + numUpVotes);
      console.log("Total down votes : " + numDownVotes);
      $("#upvoteCount").text(numUpVotes);
      $("#downvoteCount").text(numDownVotes);
    });
  });


  //display comments on page reloads
  /*remoteDSComments.getAll(function(response) {
    var Comments = App.Comments;
    var commentsSummary = new Comments(CHECKLIST_SELECTOR);
    var i = response.length;

    var numUpvotes = 0;
    var numDownvotes = 0;

    //count the number of votes in database
    for (var j = 0; j < i; j++) {
      commentsSummary.addRow(response[j]);
      if (response[j].vote == "upvote") numUpvotes++;
      if (response[j].vote == "downvote") numDownvotes++;
      console.log("up/down: " + numUpvotes + " " + numDownvotes);
    }
  });*/

  formHandlerComments.addSubmitHandler(bandName, function(data) {
    myBandComments.saveComment(data);
    commentsSummary.addRow(data);
  });

  formHandlerComments.addInputHandler();

  $("#LogoutButton").on("click", function() {
    $.removeCookie("username");
    window.location.href = "/";
  });

})(window);
