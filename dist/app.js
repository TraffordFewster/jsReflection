"use strict";

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** Class Representing an image */
var appImage =
/**
 * Create an image class
 * @param {string} url
 * @param {string} author
 * @param {string} id
 */
function appImage(url, author, id) {
  _classCallCheck(this, appImage);

  this.url = url;
  this.author = author;
  this.id = id;
  var img = new Image();
  img.src = this.url;
  this.img = img;
};
/** Class Representing the Image list */


var ImageList = /*#__PURE__*/function () {
  /**
   * Create an image class.
   * @param {number} number - The page number.
   * @callback ready - A function to return once fully setup.
   */
  function ImageList() {
    var number = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    var ready = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

    _classCallCheck(this, ImageList);

    this.pageNumber = number;
    this.listURL = 'https://picsum.photos/v2/list?page=' + number;
    this.images = [];
    this.currentImage = 0;
    this.createImages(ready);
  }
  /**
   * Get the next image in the list.
   */


  _createClass(ImageList, [{
    key: "nextImage",
    get: function get() {
      this.currentImage++;
      return this.images[this.currentImage - 1];
    }
    /**
     * Generates the list of images.
     * @callback ready - A function to return once fully setup.
     */

  }, {
    key: "createImages",
    value: function createImages(ready) {
      var _this = this;

      $.get(this.listURL, function (dataa) {
        for (var i = 0; i < dataa.length; i++) {
          var data = dataa[i];
          var image = new appImage(data.download_url, data.author, data.id);

          _this.images.push(image);
        }

        ready();
      });
    }
  }]);

  return ImageList;
}();
/**
 * Class for the email containers
 */


var emailContainer = /*#__PURE__*/function () {
  /**
   * Contructor for the email Container
   * @param {string} email - Email assigned to the container
   * @param {number} id - Unique ID of the container
   */
  function emailContainer(email, id) {
    _classCallCheck(this, emailContainer);

    this.email = email;
    this.imgList = [];
    $('.EmailBuckets').append("<div id='emailBox-".concat(id, "'>\n\t\t\t<div class=\"header\">\n\t\t\t\t<h3>").concat(email, "</h3>\n\t\t\t\t<div class=\"icons\" id=\"icons\">\n\t\t\t\t\t<span class=\"fas fa-chevron-down\"></span>\n\t\t\t\t\t<span class=\"fas fa-chevron-up hide\"></span>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"imageHolderHolder imgHHTrans\"></div>\n\t\t</div><hr />"));
    this.div = $("#emailBox-".concat(id));
    this.imageHolder = $("#emailBox-".concat(id, " .imageHolderHolder"));
  }
  /**
   * addImage - adds an image to the email container
   * @param {object} imgObj - an appImage object that is to be added to the container
   */


  _createClass(emailContainer, [{
    key: "addImage",
    value: function addImage(imgObj) {
      this.imgList.push(imgObj);
      this.imageHolder.append("<div class=\"ImageHolder\">\n\t\t\t<img src=\"".concat(imgObj.url, "\" alt=\"\" id=\"imageToChoose\" />\n\t\t</div>"));
    }
  }]);

  return emailContainer;
}();

var currentImage;
var emailCounter = 0;
var currentEmails = {};
/**
 * Gets the next image and sets the images src on the main page
 */

var nextImage = function nextImage() {
  var list = imgLists[imgLists.length - 1];
  var img = list.nextImage;

  if (list && img) {
    console.log('a');
    $('#imageToChoose').attr('src', img.url + '.jpg');
    currentImage = img;
  } else {
    console.log('b');
    var newList = new ImageList(imgLists.length + 1, function () {
      imgLists.push(newList);
      img = newList.nextImage;
      $('#imageToChoose').attr('src', img.url + '.jpg');
      currentImage = img;
    });
  }
};
/**
 * validates an email provided https://www.w3resource.com/javascript/form/email-validation.php
 * @param {string} email - email to validate
 * @returns {bool} - wether it is an email or not
 */


var validateEmail = function validateEmail(email) {
  {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
      return true;
    }

    alert('You have entered an invalid email address!');
    return false;
  }
};
/**
 * Used to when the assign button is clicked.
 */


var assignCurrentImg = function assignCurrentImg() {
  var email = $('#emailInput').val();

  if (!validateEmail(email)) {
    return;
  }

  $('#nothingHere').remove();

  if (currentEmails[email]) {
    currentEmails[email].addImage(currentImage);
  } else {
    currentEmails[email] = new emailContainer(email, emailCounter);
    currentEmails[email].addImage(currentImage);
    emailCounter++;
  }

  nextImage();
};

var imgLists = [new ImageList(1, nextImage)];
$('#newImage').click(function () {
  nextImage();
});
$('#assign').click(function () {
  assignCurrentImg();
});
$('.EmailBuckets').on('click', '.icons', function (e) {
  var el = $(e.currentTarget.parentNode.parentNode);
  var child = el.children('.imageHolderHolder');
  el.toggleClass('expanded');

  if (el.hasClass('expanded')) {
    child.css('height', 'auto'); // Set height to auto so we can grab the height

    var h = child.height(); // Get auto height

    child.css('height', 0); // Set back to 0 for the transition

    setTimeout(function () {
      // Timeout cos css is weird
      child.css('height', h); // set height

      setTimeout(function () {
        child.css('height', 'auto'); // set back to auto so if new lines are added it will still expand
      }, 500);
    }, 100);
  } else {
    var _h = child.height();

    child.css('height', _h);
    setTimeout(function () {
      child.css('height', 0);
    }, 100);
  }
}); // let list1 = new ImageList(1,() => {
//     console.log(list1.nextImage.url)
//     $("body").append('<img src="'+ list1.nextImage.url +'" alt="">')
// })
//console.log(list1.images)