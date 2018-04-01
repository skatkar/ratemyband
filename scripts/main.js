(function(window) {
  "use strict";
  var DETAIL_IMAGE_SELECTOR = "[data-image-role=\"target\"]";
  var DETAIL_TITLE_SELECTOR = "[data-image-role=\"title\"]";
  var DETAIL_FRAME_SELECTOR = "[data-image-role=\"frame\"]";
  var THUMBNAIL_LINK_SELECTOR = "[data-image-role=\"trigger\"]";
  var GENRE_LIST_SELECTOR = "[data-band-left=\"genre-list\"]";
  var LOGIN_FORM_SELECTOR = "[data-signin=\"form\"]";
  var SIGNUP_FORM_SELECTOR = "[data-signup=\"form\"]";
  var HIDDEN_DETAIL_CLASS = "hidden-detail";
  var TINY_EFFECT_CLASS = "is-tiny";
  var SERVER_URL_COMMENTS = "http://localhost:2403/user-comments";
  var SERVER_URL_BANDS = "http://localhost:2403/bands";
  var SERVER_URL_USERS = "http://localhost:2403/users";

  var App = window.App;
  var Band = App.Band;
  var RemoteDataStore = App.RemoteDataStore;
  var FormHandler = App.FormHandler;
  var User = App.User;
  var $ = window.jQuery;

  var remoteDSComments = new RemoteDataStore(SERVER_URL_COMMENTS);
  var remoteDSBands = new RemoteDataStore(SERVER_URL_BANDS);
  var remoteDSUsers = new RemoteDataStore(SERVER_URL_USERS);

  var myBandComments = new Band(remoteDSComments);
  var bandDetails = new Band(remoteDSBands);
  var userDetails = new User(remoteDSUsers);

  var loginFormHandler = new FormHandler(LOGIN_FORM_SELECTOR);
  var signupFormHandler = new FormHandler(SIGNUP_FORM_SELECTOR);

  window.myBandComments = myBandComments;
  window.bandDetails = bandDetails;
  window.userDetails = userDetails;
  //window.loginFormHandler = loginFormHandler;

  /*var commentsSummary = new Comments(CHECKLIST_SELECTOR);
  var formHandlerComments = new FormHandler(FORM_SELECTOR_COMMENTS);*/

  function setDetails(imageUrl, titleText) {
    "use strict";
    $(DETAIL_IMAGE_SELECTOR).attr("src", imageUrl);
    $(DETAIL_TITLE_SELECTOR).text(titleText);
    bandDetails.getBandInfo.call(bandDetails, titleText, function(serverResponse) {
      $("#band-description").text(serverResponse.description);
      $("#band-comments").attr("href", "review.html?bandName=" + titleText);
    });
  }

  function imageFromThumb(thumbnail) {
    "use strict";
    return thumbnail.getAttribute("data-image-url");
  }

  function titleFromThumb(thumbnail) {
    "use strict";
    return thumbnail.getAttribute("data-image-title");
  }

  function setDetailsFromThumb(thumbnail) {
    "use strict";
    setDetails(imageFromThumb(thumbnail), titleFromThumb(thumbnail));
  }

  function addThumbClickHandler(thumb) {
    thumb.addEventListener("click", function(event) {
      event.preventDefault();
      setDetailsFromThumb(thumb);
      showDetails();
    });
  }

  function getThumbnailsArray() {
    "use strict";
    var thumbnails = document.querySelectorAll(THUMBNAIL_LINK_SELECTOR);
    var thumbnailArray = [].slice.call(thumbnails);
    return thumbnailArray;
  }

  function showDetails() {
    "use strict";
    var frame = document.querySelector(DETAIL_FRAME_SELECTOR);
    document.body.classList.remove(HIDDEN_DETAIL_CLASS);
    frame.classList.add(TINY_EFFECT_CLASS);
    setTimeout(function() {
      frame.classList.remove(TINY_EFFECT_CLASS);
    }, 50);
  }


  function initializeEvents() {
    "use strict";
    var thumbnails = getThumbnailsArray();
    thumbnails.forEach(addThumbClickHandler);

  }

  $(document).ready(function() {
    bandDetails.getAllBands.call(bandDetails, function(serverResponse) {
      bandDetails.displayAllBands.call(bandDetails, serverResponse, GENRE_LIST_SELECTOR);
      initializeEvents();
    });
  });

  $("#band-comments").on("click", function(event) {
    event.preventDefault();
    //$("#band-comments").attr("href");
    if ($.cookie("username") === null || $.cookie("username") === "" ||
      $.cookie("username") === "null" || $.cookie("username") === undefined) {
      $(".form-signin").trigger("reset");
      $("#login-modal").modal();

    } else {
      window.location.href = event.currentTarget;
    }

  });

  loginFormHandler.addLoginHandler.call(loginFormHandler,function(user){
    userDetails.authenticate.call(userDetails,user,function(loginStatus){
      console.log("Login status is : " + loginStatus);
      if(loginStatus == "success"){
        $.cookie("username", user.username);
        window.location.href = $("#band-comments").attr("href");
      }else if(loginStatus == "signup"){
        $("#signup-modal").modal();
      }else{
        $("#login-error").removeClass("hide");
      }
    });
  });

  signupFormHandler.addSignupHandler.call(signupFormHandler, function(user){
    userDetails.register.call(userDetails,user);
    $.cookie("username", user.username);
    window.location.href = $("#band-comments").attr("href");
  });

})(window);
