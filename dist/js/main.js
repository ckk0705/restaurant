(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = init;
exports.filterByType = filterByType;
exports.filterByName = filterByName;
exports.filterRestaurants = filterRestaurants;

var _modal = require('./modal.js');

var Modal = _interopRequireWildcard(_modal);

var _util = require('./util.js');

var Util = _interopRequireWildcard(_util);

var _stars = require('./stars.js');

var Stars = _interopRequireWildcard(_stars);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// module variables, used to filter the restaurants by name and type
var restaurants,
    typeSelected = '',
    searchString = '';

/* 
  Initialize the application loading the restaurants data 
  and adding the event listeners to the interactive elements.
*/
function init() {

  fetch('data/restaurants.json').then(function (response) {
    return response.json();
  }).then(storeRestaurants).then(showRestaurants).catch(function (error) {
    console.error('Could not load the restaurants.', error);
  });
}

function filterByType(type) {

  typeSelected = type;
  showRestaurants(filterRestaurants());
}

function filterByName(name) {

  searchString = name;
  showRestaurants(filterRestaurants());
}

function filterRestaurants() {

  return restaurants.filter(function (restaurant) {

    var containsSearchString = true,
        isTypeSelected = true;

    if (searchString != '') {

      containsSearchString = restaurant.name.indexOf(searchString) != -1;
    }

    if (typeSelected != '') {

      isTypeSelected = restaurant.type === typeSelected;
    }

    return containsSearchString && isTypeSelected;
  });
}

/* 
  Stores the restaurants array in a variable for filters 
  They could be stored to localstorage or indexedDB
  but for this app it will do with a module variable.
*/
function storeRestaurants(res) {
  restaurants = res;
  return res;
}

/*
  Render all restaurants using the restaurant template
*/
function showRestaurants(restaurants) {

  var restaurantsList = document.getElementById('restaurants-list');
  restaurantsList.innerHTML = '';
  restaurants.forEach(function (restaurant) {

    var restaurantElem = Util.htmlToElement(restaurantTmpl(restaurant));
    var button = restaurantElem.querySelector('.reviews-button');

    button.addEventListener('click', function () {
      return Modal.openModal(restaurant);
    });

    restaurantsList.appendChild(restaurantElem);
  });
}

//---------- Templates ---------------
function restaurantTmpl(restaurant) {

  return '<article class="row" aria-label="' + restaurant.name + ' ' + Stars.calculateStars(restaurant.reviews) + ' stars">\n            <h2>\n              ' + restaurant.name + '\n              ' + Stars.starsTmpl(Stars.calculateStars(restaurant.reviews)) + '\n            </h2>\n            <div class="thumb">\n              <img src="' + restaurant.photo + '" alt="' + restaurant.name + ' Photograph">\n            </div>\n            <div class="location">\n              <span class="sr-only">Location:</span>\n              <span class="fa fa-map-marker" aria-hidden="true"></span> \n              <span>' + restaurant.address + '</span>\n              <a class="maps" href="' + mapsLink(restaurant.address) + '" target="_blank">Open in Maps</a>\n            </div>\n            <div class="opening">\n              Opens: ' + openingTmpl(restaurant.openingHours) + ' \n            </div>\n            <div class="description">\n              ' + restaurant.description + '\n            </div>\n            <input class="reviews-button" type="button" value="' + restaurant.reviews.length + ' reviews - Add your review"/>\n          </article>';
}

function openingTmpl(openingHours) {

  return openingHours.map(timeTmpl).join(' | ');
}

function timeTmpl(time) {

  return '<span class="text-success">' + time.open + ' - ' + time.close + '</span>';
}

function mapsLink(address) {

  return 'http://maps.google.com/?q=' + encodeURIComponent(address);
}

},{"./modal.js":3,"./stars.js":4,"./util.js":5}],2:[function(require,module,exports){
'use strict';

var _app = require('./app.js');

var App = _interopRequireWildcard(_app);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

(function () {

  function ready() {

    return new Promise(function (resolve, reject) {

      // resolve the promise when the document is ready
      document.addEventListener('readystatechange', function () {
        if (document.readyState !== 'loading') {
          resolve();
        }
      });
    });
  };

  ready().then(function () {
    App.init();

    // add filtering listeners
    var typeButtons = document.getElementsByName('type');
    for (var i = 0; i < typeButtons.length; i++) {
      typeButtons[i].addEventListener('change', function () {

        App.filterByType(this.value);
      });
    }

    // Add input listener for the search box, we want to update
    // the list on each keystroke (the list is already completely 
    // loaded so this doesn't make more requests)
    var nameFilter = document.getElementById('searchbox');
    nameFilter.addEventListener('input', function () {

      App.filterByName(this.value);
    });
  });
})();

},{"./app.js":1}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.openModal = openModal;
exports.closeModal = closeModal;

var _util = require('./util.js');

var Util = _interopRequireWildcard(_util);

var _stars = require('./stars.js');

var Stars = _interopRequireWildcard(_stars);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var focusableElementsString = 'a[href], [role="slider"], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';

var wrapper, modal, overlay, submitButton, closeButton, focusedElementBeforeModal;

function openModal(restaurant) {

  wrapper = document.getElementById('wrapper');
  modal = Util.htmlToElement(modalTmpl(restaurant));
  document.body.appendChild(modal);

  overlay = document.getElementById('overlay');
  closeButton = document.getElementById('close-modal');
  submitButton = document.getElementById('add-review');

  focusedElementBeforeModal = document.activeElement;

  // shows the modal and hides the rest of the content for
  // screen readers
  modal.removeAttribute('hidden');
  window.requestAnimationFrame(function () {
    modal.className = 'show';
  });
  wrapper.setAttribute('aria-hidden', true);

  closeButton.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  submitButton.addEventListener('click', submitReview(restaurant));
  Stars.addListeners();

  // Add keyboard listener to create the focus-trap

  var _findFocusLimitElemen = findFocusLimitElements(modal);

  var firstElement = _findFocusLimitElemen.firstElement;
  var lastElement = _findFocusLimitElemen.lastElement;

  modal.addEventListener('keydown', focusTrapController(firstElement, lastElement));
}

function closeModal() {

  wrapper.removeAttribute('aria-hidden');
  modal.className = '';

  var transitionEvent = Util.whichTransitionEvent();
  transitionEvent && modal.addEventListener(transitionEvent, removeModal);
}

function submitReview(restaurant) {

  return function () {

    var name = document.getElementById('review-name');
    var comment = document.getElementById('comment');
    var stars = document.getElementById('stars-rating');
    var review = {
      name: name.value,
      comment: comment.value,
      stars: stars.getAttribute('aria-valuenow'),
      created_at: Date.now()
    };

    restaurant.reviews.push(review);
    removeModal();
    openModal(restaurant);
  };
}

function removeModal() {
  document.body.removeChild(modal);
}

function findFocusLimitElements(modal) {

  // Find all focusable children
  var focusableElements = modal.querySelectorAll(focusableElementsString);

  return {
    firstElement: focusableElements[0],
    lastElement: focusableElements[focusableElements.length - 1]
  };
}

function focusTrapController(firstElement, lastElement) {

  firstElement.focus();

  return function (evt) {
    // Check for TAB key press
    if (evt.keyCode === 9) {

      // SHIFT + TAB
      if (evt.shiftKey) {
        if (document.activeElement === firstElement) {
          evt.preventDefault();
          lastElement.focus();
        }

        // TAB
      } else {
        if (document.activeElement === lastElement) {
          evt.preventDefault();
          firstElement.focus();
        }
      }
    }

    // ESCAPE
    if (evt.keyCode === 27) {
      closeModal();
    }
  };
}

function modalTmpl(restaurant) {
  return '<div id="modal" role="dialog" aria-labelledby="modal-title" hidden>\n            <div id="overlay"></div>\n            <div id="dialog">\n              <header>\n                <h3 id="modal-title">' + restaurant.name + '</h3>\n              </header>\n              <div class="content">\n                ' + reviewsTmpl(restaurant.reviews) + '\n                <div class="new-review">\n                  <form aria-labelledby="form-title">\n                    <h3 id="form-title">Add your review</h3>\n                    ' + Stars.starsRating() + '\n                    <input id="review-name" \n                           type="text" \n                           name="name" \n                           placeholder="Your name"\n                           aria-label="Your name"\n                           autocomplete="name">\n                    <textarea id="comment" \n                              name="comment"\n                              aria-label="Comment" \n                              placeholder="Tell something about your experience in this restaurant."></textarea>\n                  </form>\n                </div>\n              </div>\n              <footer>\n                <input id="add-review" type="button" name="addReview" value="Submit">\n                <input id="close-modal" type="button" name="closeModal" value="Close">\n              </footer>\n            </div>\n          </div>';
}

function reviewsTmpl(reviews) {

  return reviews.map(reviewTmpl).join('');
}

function reviewTmpl(review) {

  var date = new Date(parseInt(review.created_at));
  return '<div class="review">\n            <p class="author">\n              ' + Stars.starsTmpl(review.stars) + '\n              <span>by ' + review.name + ' on ' + date.toLocaleString() + '</span>              \n            </p>\n            <p class="comment">\n              ' + review.comment + '\n            </p>\n          </div>';
}

},{"./stars.js":4,"./util.js":5}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateStars = calculateStars;
exports.starsTmpl = starsTmpl;
exports.starsRating = starsRating;
exports.addListeners = addListeners;
exports.starsRatingKeydownHandler = starsRatingKeydownHandler;
exports.starsRatingHoverHandler = starsRatingHoverHandler;
/*
  Calculate the average from all stars in the reviews
*/
function calculateStars(reviews) {

  var stars = reviews.map(function (review) {
    return review.stars;
  });
  return avg(stars);
}

function starsTmpl(number) {

  return '<div class="stars">\n            <span class="sr-only">' + number + ' stars</span>\n            <i class="fa fa-star ' + starType(1, number) + '" aria-hidden="true"></i>\n            <i class="fa fa-star ' + starType(2, number) + '" aria-hidden="true"></i>\n            <i class="fa fa-star ' + starType(3, number) + '" aria-hidden="true"></i>\n            <i class="fa fa-star ' + starType(4, number) + '" aria-hidden="true"></i>\n            <i class="fa fa-star ' + starType(5, number) + '" aria-hidden="true"></i>\n          </div>';
}

function starsRating() {

  return '<div id="stars-rating" \n               role="slider"\n               tabindex="0"\n               aria-label="Please select a number of stars" \n               aria-live="polite"\n               aria-valuemin="0"\n               aria-valuemax="5"\n               aria-valuenow="0"\n               aria-valuetext="zero">\n            <i class="fa fa-star empty" aria-hidden="true"></i>\n            <i class="fa fa-star empty" aria-hidden="true"></i>\n            <i class="fa fa-star empty" aria-hidden="true"></i>\n            <i class="fa fa-star empty" aria-hidden="true"></i>\n            <i class="fa fa-star empty" aria-hidden="true"></i>\n          </div>';
}

function addListeners() {

  var starsRating = document.getElementById('stars-rating');

  starsRating.addEventListener('keydown', starsRatingKeydownHandler);

  for (var i = 0; i < starsRating.children.length; i++) {
    starsRating.children[i].addEventListener('mouseover', starsRatingHoverHandler);
  }
}

function starsRatingKeydownHandler(evt) {

  var valueTexts = ['zero stars', 'one star', 'two stars', 'three stars', 'four stars', 'five stars'];
  var elem = evt.target;
  switch (evt.keyCode) {

    // Arrow LEFT/DOWN
    case 37:
    case 40:
      evt.preventDefault();
      var value = parseInt(elem.getAttribute('aria-valuenow')) - 1; // 0-5 values
      if (value < 0) {
        value = 5;
      }
      elem.setAttribute('aria-valuenow', value);
      fillStars(elem);
      break;

    // Arrow RIGHT/UP
    case 38:
    case 39:
      evt.preventDefault();
      var value = (parseInt(elem.getAttribute('aria-valuenow')) + 1) % 6;
      elem.setAttribute('aria-valuenow', value);
      elem.setAttribute('aria-valuetext', valueTexts[value]);
      fillStars(elem);
      break;

  }
}

function starsRatingHoverHandler(evt) {

  var elem = evt.target.parentElement;
  var i = Array.prototype.indexOf.call(elem.children, evt.target);
  elem.setAttribute('aria-valuenow', i + 1);
  fillStars(elem);
}

function fillStars(elem) {
  var value = elem.getAttribute('aria-valuenow');
  for (var i = 0; i < elem.children.length; i++) {
    elem.children[i].className = 'fa fa-star ' + starType(i + 1, value);
  }
}

/*
  Average of an array of numbers
*/
function avg(array) {
  return array.reduce(function (prev, cur) {
    return prev + cur;
  }, 0) / array.length;
}

/*
  Calculate how full is the current star
*/
function starType(order, number) {

  if (number - order == -0.5) {
    return 'half';
  } else if (number - order >= 0) {
    return 'full';
  }

  return 'empty';
}

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.htmlToElement = htmlToElement;
exports.whichTransitionEvent = whichTransitionEvent;
function htmlToElement(html) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.firstChild;
}

/*
  Selects the browser transition event, from:
  https://davidwalsh.name/css-animation-callback
*/
function whichTransitionEvent() {
    var t;
    var el = document.createElement('fakeelement');
    var transitions = {
        'transition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'MozTransition': 'transitionend',
        'WebkitTransition': 'webkitTransitionEnd'
    };

    for (t in transitions) {
        if (el.style[t] !== undefined) {
            return transitions[t];
        }
    }
}

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9hcHAuanMiLCJqcy9tYWluLmpzIiwianMvbW9kYWwuanMiLCJqcy9zdGFycy5qcyIsImpzL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztRQ2FnQixJLEdBQUEsSTtRQVlBLFksR0FBQSxZO1FBT0EsWSxHQUFBLFk7UUFPQSxpQixHQUFBLGlCOztBQXZDaEI7O0lBQVksSzs7QUFDWjs7SUFBWSxJOztBQUNaOztJQUFZLEs7Ozs7QUFFWjtBQUNBLElBQUksV0FBSjtBQUFBLElBQ0EsZUFBZSxFQURmO0FBQUEsSUFFQSxlQUFlLEVBRmY7O0FBSUE7Ozs7QUFJTyxTQUFTLElBQVQsR0FBZ0I7O0FBRXJCLFFBQU0sdUJBQU4sRUFDRyxJQURILENBQ1E7QUFBQSxXQUFZLFNBQVMsSUFBVCxFQUFaO0FBQUEsR0FEUixFQUVHLElBRkgsQ0FFUSxnQkFGUixFQUdHLElBSEgsQ0FHUSxlQUhSLEVBSUcsS0FKSCxDQUlTLFVBQVMsS0FBVCxFQUFnQjtBQUNyQixZQUFRLEtBQVIsQ0FBYyxpQ0FBZCxFQUFpRCxLQUFqRDtBQUNELEdBTkg7QUFRRDs7QUFFTSxTQUFTLFlBQVQsQ0FBc0IsSUFBdEIsRUFBNEI7O0FBRWpDLGlCQUFlLElBQWY7QUFDQSxrQkFBZ0IsbUJBQWhCO0FBRUQ7O0FBRU0sU0FBUyxZQUFULENBQXNCLElBQXRCLEVBQTRCOztBQUVqQyxpQkFBZSxJQUFmO0FBQ0Esa0JBQWdCLG1CQUFoQjtBQUVEOztBQUVNLFNBQVMsaUJBQVQsR0FBNkI7O0FBRWxDLFNBQU8sWUFBWSxNQUFaLENBQW1CLFVBQUMsVUFBRCxFQUFnQjs7QUFFeEMsUUFBSSx1QkFBdUIsSUFBM0I7QUFBQSxRQUNBLGlCQUFpQixJQURqQjs7QUFHQSxRQUFHLGdCQUFnQixFQUFuQixFQUF1Qjs7QUFFckIsNkJBQXVCLFdBQVcsSUFBWCxD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dGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0ICogYXMgTW9kYWwgZnJvbSAnLi9tb2RhbC5qcyc7XG5pbXBvcnQgKiBhcyBVdGlsIGZyb20gJy4vdXRpbC5qcyc7XG5pbXBvcnQgKiBhcyBTdGFycyBmcm9tICcuL3N0YXJzLmpzJztcblxuLy8gbW9kdWxlIHZhcmlhYmxlcywgdXNlZCB0byBmaWx0ZXIgdGhlIHJlc3RhdXJhbnRzIGJ5IG5hbWUgYW5kIHR5cGVcbnZhciByZXN0YXVyYW50cywgXG50eXBlU2VsZWN0ZWQgPSAnJywgXG5zZWFyY2hTdHJpbmcgPSAnJztcblxuLyogXG4gIEluaXRpYWxpemUgdGhlIGFwcGxpY2F0aW9uIGxvYWRpbmcgdGhlIHJlc3RhdXJhbnRzIGRhdGEgXG4gIGFuZCBhZGRpbmcgdGhlIGV2ZW50IGxpc3RlbmVycyB0byB0aGUgaW50ZXJhY3RpdmUgZWxlbWVudHMuXG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG5cbiAgZmV0Y2goJ2RhdGEvcmVzdGF1cmFudHMuanNvbicpXG4gICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgIC50aGVuKHN0b3JlUmVzdGF1cmFudHMpXG4gICAgLnRoZW4oc2hvd1Jlc3RhdXJhbnRzKVxuICAgIC5jYXRjaChmdW5jdGlvbihlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignQ291bGQgbm90IGxvYWQgdGhlIHJlc3RhdXJhbnRzLicsIGVycm9yKTtcbiAgICB9KTtcblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyQnlUeXBlKHR5cGUpIHtcblxuICB0eXBlU2VsZWN0ZWQgPSB0eXBlO1xuICBzaG93UmVzdGF1cmFudHMoZmlsdGVyUmVzdGF1cmFudHMoKSk7XG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckJ5TmFtZShuYW1lKSB7XG4gIFxuICBzZWFyY2hTdHJpbmcgPSBuYW1lO1xuICBzaG93UmVzdGF1cmFudHMoZmlsdGVyUmVzdGF1cmFudHMoKSk7XG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlclJlc3RhdXJhbnRzKCkge1xuXG4gIHJldHVybiByZXN0YXVyYW50cy5maWx0ZXIoKHJlc3RhdXJhbnQpID0+IHtcbiAgICBcbiAgICB2YXIgY29udGFpbnNTZWFyY2hTdHJpbmcgPSB0cnVlLCBcbiAgICBpc1R5cGVTZWxlY3RlZCA9IHRydWU7XG4gICAgXG4gICAgaWYoc2VhcmNoU3RyaW5nICE9ICcnKSB7XG4gIFxuICAgICAgY29udGFpbnNTZWFyY2hTdHJpbmcgPSByZXN0YXVyYW50Lm5hbWUuaW5kZXhPZihzZWFyY2hTdHJpbmcpICE9IC0xO1xuICBcbiAgICB9IFxuXG4gICAgaWYodHlwZVNlbGVjdGVkICE9ICcnKXtcblxuICAgICAgaXNUeXBlU2VsZWN0ZWQgPSAocmVzdGF1cmFudC50eXBlID09PSB0eXBlU2VsZWN0ZWQpO1xuXG4gICAgfSBcblxuICAgIHJldHVybiBjb250YWluc1NlYXJjaFN0cmluZyAmJiBpc1R5cGVTZWxlY3RlZDtcbiAgICBcbiAgfSk7XG5cbn1cblxuLyogXG4gIFN0b3JlcyB0aGUgcmVzdGF1cmFudHMgYXJyYXkgaW4gYSB2YXJpYWJsZSBmb3IgZmlsdGVycyBcbiAgVGhleSBjb3VsZCBiZSBzdG9yZWQgdG8gbG9jYWxzdG9yYWdlIG9yIGluZGV4ZWREQlxuICBidXQgZm9yIHRoaXMgYXBwIGl0IHdpbGwgZG8gd2l0aCBhIG1vZHVsZSB2YXJpYWJsZS5cbiovXG5mdW5jdGlvbiBzdG9yZVJlc3RhdXJhbnRzKHJlcykge1xuICByZXN0YXVyYW50cyA9IHJlcztcbiAgcmV0dXJuIHJlcztcbn1cblxuLypcbiAgUmVuZGVyIGFsbCByZXN0YXVyYW50cyB1c2luZyB0aGUgcmVzdGF1cmFudCB0ZW1wbGF0ZVxuKi9cbmZ1bmN0aW9uIHNob3dSZXN0YXVyYW50cyhyZXN0YXVyYW50cykge1xuICBcbiAgdmFyIHJlc3RhdXJhbnRzTGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXVyYW50cy1saXN0Jyk7XG4gIHJlc3RhdXJhbnRzTGlzdC5pbm5lckhUTUwgPSAnJztcbiAgcmVzdGF1cmFudHMuZm9yRWFjaCgocmVzdGF1cmFudCkgPT4ge1xuXG4gICAgdmFyIHJlc3RhdXJhbnRFbGVtID0gVXRpbC5odG1sVG9FbGVtZW50KHJlc3RhdXJhbnRUbXBsKHJlc3RhdXJhbnQpKTtcbiAgICB2YXIgYnV0dG9uID0gcmVzdGF1cmFudEVsZW0ucXVlcnlTZWxlY3RvcignLnJldmlld3MtYnV0dG9uJyk7XG5cbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIE1vZGFsLm9wZW5Nb2RhbChyZXN0YXVyYW50KTtcbiAgICB9KTtcblxuICAgIHJlc3RhdXJhbnRzTGlzdC5hcHBlbmRDaGlsZChyZXN0YXVyYW50RWxlbSk7XG5cbiAgfSk7XG5cbn1cblxuLy8tLS0tLS0tLS0tIFRlbXBsYXRlcyAtLS0tLS0tLS0tLS0tLS1cbmZ1bmN0aW9uIHJlc3RhdXJhbnRUbXBsKHJlc3RhdXJhbnQpIHtcblxuICByZXR1cm4gYDxhcnRpY2xlIGNsYXNzPVwicm93XCIgYXJpYS1sYWJlbD1cIiR7cmVzdGF1cmFudC5uYW1lfSAke1N0YXJzLmNhbGN1bGF0ZVN0YXJzKHJlc3RhdXJhbnQucmV2aWV3cyl9IHN0YXJzXCI+XG4gICAgICAgICAgICA8aDI+XG4gICAgICAgICAgICAgICR7cmVzdGF1cmFudC5uYW1lfVxuICAgICAgICAgICAgICAke1N0YXJzLnN0YXJzVG1wbChTdGFycy5jYWxjdWxhdGVTdGFycyhyZXN0YXVyYW50LnJldmlld3MpKX1cbiAgICAgICAgICAgIDwvaDI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGh1bWJcIj5cbiAgICAgICAgICAgICAgPGltZyBzcmM9XCIke3Jlc3RhdXJhbnQucGhvdG99XCIgYWx0PVwiJHtyZXN0YXVyYW50Lm5hbWV9IFBob3RvZ3JhcGhcIj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxvY2F0aW9uXCI+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic3Itb25seVwiPkxvY2F0aW9uOjwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJmYSBmYS1tYXAtbWFya2VyXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPiBcbiAgICAgICAgICAgICAgPHNwYW4+JHtyZXN0YXVyYW50LmFkZHJlc3N9PC9zcGFuPlxuICAgICAgICAgICAgICA8YSBjbGFzcz1cIm1hcHNcIiBocmVmPVwiJHttYXBzTGluayhyZXN0YXVyYW50LmFkZHJlc3MpfVwiIHRhcmdldD1cIl9ibGFua1wiPk9wZW4gaW4gTWFwczwvYT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm9wZW5pbmdcIj5cbiAgICAgICAgICAgICAgT3BlbnM6ICR7b3BlbmluZ1RtcGwocmVzdGF1cmFudC5vcGVuaW5nSG91cnMpfSBcbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRlc2NyaXB0aW9uXCI+XG4gICAgICAgICAgICAgICR7cmVzdGF1cmFudC5kZXNjcmlwdGlvbn1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwicmV2aWV3cy1idXR0b25cIiB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCIke3Jlc3RhdXJhbnQucmV2aWV3cy5sZW5ndGh9IHJldmlld3MgLSBBZGQgeW91ciByZXZpZXdcIi8+XG4gICAgICAgICAgPC9hcnRpY2xlPmA7XG5cbn1cblxuZnVuY3Rpb24gb3BlbmluZ1RtcGwob3BlbmluZ0hvdXJzKSB7XG5cbiAgcmV0dXJuIG9wZW5pbmdIb3Vycy5tYXAodGltZVRtcGwpLmpvaW4oJyB8ICcpO1xuXG59XG5cbmZ1bmN0aW9uIHRpbWVUbXBsKHRpbWUpIHtcblxuICByZXR1cm4gYDxzcGFuIGNsYXNzPVwidGV4dC1zdWNjZXNzXCI+JHt0aW1lLm9wZW59IC0gJHt0aW1lLmNsb3NlfTwvc3Bhbj5gO1xuXG59XG5cbmZ1bmN0aW9uIG1hcHNMaW5rKGFkZHJlc3MpIHtcblxuICByZXR1cm4gYGh0dHA6Ly9tYXBzLmdvb2dsZS5jb20vP3E9JHtlbmNvZGVVUklDb21wb25lbnQoYWRkcmVzcyl9YDtcblxufVxuIiwiaW1wb3J0ICogYXMgQXBwIGZyb20gJy4vYXBwLmpzJztcblxuKGZ1bmN0aW9uKCkge1xuXG4gIGZ1bmN0aW9uIHJlYWR5KCkge1xuICAgICAgXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgXG4gICAgICAvLyByZXNvbHZlIHRoZSBwcm9taXNlIHdoZW4gdGhlIGRvY3VtZW50IGlzIHJlYWR5XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdyZWFkeXN0YXRlY2hhbmdlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKGRvY3VtZW50LnJlYWR5U3RhdGUgIT09ICdsb2FkaW5nJykge1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB9KTtcblxuICB9O1xuXG4gIHJlYWR5KCkudGhlbihmdW5jdGlvbigpIHtcbiAgICBBcHAuaW5pdCgpO1xuXG4gICAgLy8gYWRkIGZpbHRlcmluZyBsaXN0ZW5lcnNcbiAgICB2YXIgdHlwZUJ1dHRvbnMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZSgndHlwZScpO1xuICAgIGZvcih2YXIgaT0wOyBpIDwgdHlwZUJ1dHRvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHR5cGVCdXR0b25zW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgQXBwLmZpbHRlckJ5VHlwZSh0aGlzLnZhbHVlKTtcblxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gQWRkIGlucHV0IGxpc3RlbmVyIGZvciB0aGUgc2VhcmNoIGJveCwgd2Ugd2FudCB0byB1cGRhdGVcbiAgICAvLyB0aGUgbGlzdCBvbiBlYWNoIGtleXN0cm9rZSAodGhlIGxpc3QgaXMgYWxyZWFkeSBjb21wbGV0ZWx5IFxuICAgIC8vIGxvYWRlZCBzbyB0aGlzIGRvZXNuJ3QgbWFrZSBtb3JlIHJlcXVlc3RzKVxuICAgIHZhciBuYW1lRmlsdGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlYXJjaGJveCcpO1xuICAgIG5hbWVGaWx0ZXIuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbigpIHtcblxuICAgICAgQXBwLmZpbHRlckJ5TmFtZSh0aGlzLnZhbHVlKTtcblxuICAgIH0pO1xuXG4gIH0pO1xuXG59KSgpOyIsImltcG9ydCAqIGFzIFV0aWwgZnJvbSAnLi91dGlsLmpzJztcbmltcG9ydCAqIGFzIFN0YXJzIGZyb20gJy4vc3RhcnMuanMnO1xuXG5jb25zdCBmb2N1c2FibGVFbGVtZW50c1N0cmluZyA9ICdhW2hyZWZdLCBbcm9sZT1cInNsaWRlclwiXSwgYXJlYVtocmVmXSwgaW5wdXQ6bm90KFtkaXNhYmxlZF0pLCBzZWxlY3Q6bm90KFtkaXNhYmxlZF0pLCB0ZXh0YXJlYTpub3QoW2Rpc2FibGVkXSksIGJ1dHRvbjpub3QoW2Rpc2FibGVkXSksIGlmcmFtZSwgb2JqZWN0LCBlbWJlZCwgW3RhYmluZGV4PVwiMFwiXSwgW2NvbnRlbnRlZGl0YWJsZV0nO1xuXG52YXIgd3JhcHBlciwgbW9kYWwsIG92ZXJsYXksIHN1Ym1pdEJ1dHRvbiwgY2xvc2VCdXR0b24sIGZvY3VzZWRFbGVtZW50QmVmb3JlTW9kYWw7XG5cbmV4cG9ydCBmdW5jdGlvbiBvcGVuTW9kYWwocmVzdGF1cmFudCkge1xuXG4gIHdyYXBwZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd3JhcHBlcicpO1xuICBtb2RhbCA9IFV0aWwuaHRtbFRvRWxlbWVudChtb2RhbFRtcGwocmVzdGF1cmFudCkpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG1vZGFsKTtcbiAgXG4gIG92ZXJsYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnb3ZlcmxheScpO1xuICBjbG9zZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbG9zZS1tb2RhbCcpO1xuICBzdWJtaXRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWRkLXJldmlldycpO1xuXG4gIGZvY3VzZWRFbGVtZW50QmVmb3JlTW9kYWwgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuXG4gIC8vIHNob3dzIHRoZSBtb2RhbCBhbmQgaGlkZXMgdGhlIHJlc3Qgb2YgdGhlIGNvbnRlbnQgZm9yXG4gIC8vIHNjcmVlbiByZWFkZXJzXG4gIG1vZGFsLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XG4gIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKXtcbiAgICBtb2RhbC5jbGFzc05hbWUgPSAnc2hvdyc7XG4gIH0pO1xuICB3cmFwcGVyLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCB0cnVlKTtcblxuICBjbG9zZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlTW9kYWwpO1xuICBvdmVybGF5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VNb2RhbCk7XG4gIHN1Ym1pdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHN1Ym1pdFJldmlldyhyZXN0YXVyYW50KSk7XG4gIFN0YXJzLmFkZExpc3RlbmVycygpOyBcblxuICAvLyBBZGQga2V5Ym9hcmQgbGlzdGVuZXIgdG8gY3JlYXRlIHRoZSBmb2N1cy10cmFwXG4gIHZhciB7Zmlyc3RFbGVtZW50LCBsYXN0RWxlbWVudH0gPSBmaW5kRm9jdXNMaW1pdEVsZW1lbnRzKG1vZGFsKTtcbiAgbW9kYWwuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGZvY3VzVHJhcENvbnRyb2xsZXIoZmlyc3RFbGVtZW50LCBsYXN0RWxlbWVudCkpO1xuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbG9zZU1vZGFsKCkge1xuXG4gIHdyYXBwZXIucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWhpZGRlbicpO1xuICBtb2RhbC5jbGFzc05hbWUgPSAnJztcbiAgXG4gIHZhciB0cmFuc2l0aW9uRXZlbnQgPSBVdGlsLndoaWNoVHJhbnNpdGlvbkV2ZW50KCk7XG4gIHRyYW5zaXRpb25FdmVudCAmJiBtb2RhbC5hZGRFdmVudExpc3RlbmVyKHRyYW5zaXRpb25FdmVudCwgcmVtb3ZlTW9kYWwpO1xuXG59XG5cbmZ1bmN0aW9uIHN1Ym1pdFJldmlldyhyZXN0YXVyYW50KSB7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKCl7XG5cbiAgICB2YXIgbmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXZpZXctbmFtZScpO1xuICAgIHZhciBjb21tZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbW1lbnQnKTtcbiAgICB2YXIgc3RhcnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhcnMtcmF0aW5nJyk7XG4gICAgdmFyIHJldmlldyA9IHtcbiAgICAgIG5hbWU6IG5hbWUudmFsdWUsXG4gICAgICBjb21tZW50OiBjb21tZW50LnZhbHVlLFxuICAgICAgc3RhcnM6IHN0YXJzLmdldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZW5vdycpLFxuICAgICAgY3JlYXRlZF9hdDogRGF0ZS5ub3coKVxuICAgIH07XG5cbiAgICByZXN0YXVyYW50LnJldmlld3MucHVzaChyZXZpZXcpO1xuICAgIHJlbW92ZU1vZGFsKCk7XG4gICAgb3Blbk1vZGFsKHJlc3RhdXJhbnQpO1xuXG4gIH07ICBcblxufVxuXG5mdW5jdGlvbiByZW1vdmVNb2RhbCgpIHtcbiAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChtb2RhbCk7XG59XG5cbmZ1bmN0aW9uIGZpbmRGb2N1c0xpbWl0RWxlbWVudHMobW9kYWwpIHtcblxuICAvLyBGaW5kIGFsbCBmb2N1c2FibGUgY2hpbGRyZW5cbiAgdmFyIGZvY3VzYWJsZUVsZW1lbnRzID0gbW9kYWwucXVlcnlTZWxlY3RvckFsbChmb2N1c2FibGVFbGVtZW50c1N0cmluZyk7XG4gIFxuICByZXR1cm4ge1xuICAgIGZpcnN0RWxlbWVudDogZm9jdXNhYmxlRWxlbWVudHNbMF0sXG4gICAgbGFzdEVsZW1lbnQ6IGZvY3VzYWJsZUVsZW1lbnRzW2ZvY3VzYWJsZUVsZW1lbnRzLmxlbmd0aCAtIDFdXG4gIH07XG5cbn1cblxuZnVuY3Rpb24gZm9jdXNUcmFwQ29udHJvbGxlcihmaXJzdEVsZW1lbnQsIGxhc3RFbGVtZW50KSB7XG5cbiAgZmlyc3RFbGVtZW50LmZvY3VzKCk7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKGV2dCkge1xuICAgIC8vIENoZWNrIGZvciBUQUIga2V5IHByZXNzXG4gICAgaWYgKGV2dC5rZXlDb2RlID09PSA5KSB7XG5cbiAgICAgIC8vIFNISUZUICsgVEFCXG4gICAgICBpZiAoZXZ0LnNoaWZ0S2V5KSB7XG4gICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBmaXJzdEVsZW1lbnQpIHtcbiAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBsYXN0RWxlbWVudC5mb2N1cygpO1xuICAgICAgICB9XG5cbiAgICAgIC8vIFRBQlxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGxhc3RFbGVtZW50KSB7XG4gICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgZmlyc3RFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBFU0NBUEVcbiAgICBpZiAoZXZ0LmtleUNvZGUgPT09IDI3KSB7XG4gICAgICBjbG9zZU1vZGFsKCk7XG4gICAgfVxuICB9O1xuXG59XG5cbmZ1bmN0aW9uIG1vZGFsVG1wbChyZXN0YXVyYW50KSB7XG4gIHJldHVybiBgPGRpdiBpZD1cIm1vZGFsXCIgcm9sZT1cImRpYWxvZ1wiIGFyaWEtbGFiZWxsZWRieT1cIm1vZGFsLXRpdGxlXCIgaGlkZGVuPlxuICAgICAgICAgICAgPGRpdiBpZD1cIm92ZXJsYXlcIj48L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgaWQ9XCJkaWFsb2dcIj5cbiAgICAgICAgICAgICAgPGhlYWRlcj5cbiAgICAgICAgICAgICAgICA8aDMgaWQ9XCJtb2RhbC10aXRsZVwiPiR7cmVzdGF1cmFudC5uYW1lfTwvaDM+XG4gICAgICAgICAgICAgIDwvaGVhZGVyPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGVudFwiPlxuICAgICAgICAgICAgICAgICR7cmV2aWV3c1RtcGwocmVzdGF1cmFudC5yZXZpZXdzKX1cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibmV3LXJldmlld1wiPlxuICAgICAgICAgICAgICAgICAgPGZvcm0gYXJpYS1sYWJlbGxlZGJ5PVwiZm9ybS10aXRsZVwiPlxuICAgICAgICAgICAgICAgICAgICA8aDMgaWQ9XCJmb3JtLXRpdGxlXCI+QWRkIHlvdXIgcmV2aWV3PC9oMz5cbiAgICAgICAgICAgICAgICAgICAgJHtTdGFycy5zdGFyc1JhdGluZygpfVxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJyZXZpZXctbmFtZVwiIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU9XCJuYW1lXCIgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIllvdXIgbmFtZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPVwiWW91ciBuYW1lXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGF1dG9jb21wbGV0ZT1cIm5hbWVcIj5cbiAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIGlkPVwiY29tbWVudFwiIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZT1cImNvbW1lbnRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cIkNvbW1lbnRcIiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiVGVsbCBzb21ldGhpbmcgYWJvdXQgeW91ciBleHBlcmllbmNlIGluIHRoaXMgcmVzdGF1cmFudC5cIj48L3RleHRhcmVhPlxuICAgICAgICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGZvb3Rlcj5cbiAgICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJhZGQtcmV2aWV3XCIgdHlwZT1cImJ1dHRvblwiIG5hbWU9XCJhZGRSZXZpZXdcIiB2YWx1ZT1cIlN1Ym1pdFwiPlxuICAgICAgICAgICAgICAgIDxpbnB1dCBpZD1cImNsb3NlLW1vZGFsXCIgdHlwZT1cImJ1dHRvblwiIG5hbWU9XCJjbG9zZU1vZGFsXCIgdmFsdWU9XCJDbG9zZVwiPlxuICAgICAgICAgICAgICA8L2Zvb3Rlcj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PmA7XG59XG5cbmZ1bmN0aW9uIHJldmlld3NUbXBsKHJldmlld3MpIHtcblxuICByZXR1cm4gcmV2aWV3cy5tYXAocmV2aWV3VG1wbCkuam9pbignJyk7XG5cbn1cblxuZnVuY3Rpb24gcmV2aWV3VG1wbChyZXZpZXcpIHtcblxuICB2YXIgZGF0ZSA9IG5ldyBEYXRlKHBhcnNlSW50KHJldmlldy5jcmVhdGVkX2F0KSk7XG4gIHJldHVybiBgPGRpdiBjbGFzcz1cInJldmlld1wiPlxuICAgICAgICAgICAgPHAgY2xhc3M9XCJhdXRob3JcIj5cbiAgICAgICAgICAgICAgJHtTdGFycy5zdGFyc1RtcGwocmV2aWV3LnN0YXJzKX1cbiAgICAgICAgICAgICAgPHNwYW4+YnkgJHtyZXZpZXcubmFtZX0gb24gJHtkYXRlLnRvTG9jYWxlU3RyaW5nKCl9PC9zcGFuPiAgICAgICAgICAgICAgXG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8cCBjbGFzcz1cImNvbW1lbnRcIj5cbiAgICAgICAgICAgICAgJHtyZXZpZXcuY29tbWVudH1cbiAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICA8L2Rpdj5gO1xuXG59IiwiLypcbiAgQ2FsY3VsYXRlIHRoZSBhdmVyYWdlIGZyb20gYWxsIHN0YXJzIGluIHRoZSByZXZpZXdzXG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGNhbGN1bGF0ZVN0YXJzKHJldmlld3MpIHtcblxuICB2YXIgc3RhcnMgPSByZXZpZXdzLm1hcCgocmV2aWV3KSA9PiByZXZpZXcuc3RhcnMpO1xuICByZXR1cm4gYXZnKHN0YXJzKSA7XG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0YXJzVG1wbChudW1iZXIpIHtcblxuICByZXR1cm4gYDxkaXYgY2xhc3M9XCJzdGFyc1wiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzci1vbmx5XCI+JHtudW1iZXJ9IHN0YXJzPC9zcGFuPlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1zdGFyICR7c3RhclR5cGUoMSwgbnVtYmVyKX1cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXN0YXIgJHtzdGFyVHlwZSgyLCBudW1iZXIpfVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtc3RhciAke3N0YXJUeXBlKDMsIG51bWJlcil9XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1zdGFyICR7c3RhclR5cGUoNCwgbnVtYmVyKX1cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXN0YXIgJHtzdGFyVHlwZSg1LCBudW1iZXIpfVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cbiAgICAgICAgICA8L2Rpdj5gO1xuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdGFyc1JhdGluZygpIHtcblxuICByZXR1cm4gYDxkaXYgaWQ9XCJzdGFycy1yYXRpbmdcIiBcbiAgICAgICAgICAgICAgIHJvbGU9XCJzbGlkZXJcIlxuICAgICAgICAgICAgICAgdGFiaW5kZXg9XCIwXCJcbiAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJQbGVhc2Ugc2VsZWN0IGEgbnVtYmVyIG9mIHN0YXJzXCIgXG4gICAgICAgICAgICAgICBhcmlhLWxpdmU9XCJwb2xpdGVcIlxuICAgICAgICAgICAgICAgYXJpYS12YWx1ZW1pbj1cIjBcIlxuICAgICAgICAgICAgICAgYXJpYS12YWx1ZW1heD1cIjVcIlxuICAgICAgICAgICAgICAgYXJpYS12YWx1ZW5vdz1cIjBcIlxuICAgICAgICAgICAgICAgYXJpYS12YWx1ZXRleHQ9XCJ6ZXJvXCI+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXN0YXIgZW1wdHlcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXN0YXIgZW1wdHlcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXN0YXIgZW1wdHlcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXN0YXIgZW1wdHlcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXN0YXIgZW1wdHlcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XG4gICAgICAgICAgPC9kaXY+YDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZExpc3RlbmVycygpIHtcblxuICB2YXIgc3RhcnNSYXRpbmcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhcnMtcmF0aW5nJyk7XG4gIFxuICBzdGFyc1JhdGluZy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgc3RhcnNSYXRpbmdLZXlkb3duSGFuZGxlcik7XG5cbiAgZm9yKHZhciBpPTA7IGkgPCBzdGFyc1JhdGluZy5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgIHN0YXJzUmF0aW5nLmNoaWxkcmVuW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIHN0YXJzUmF0aW5nSG92ZXJIYW5kbGVyKTtcbiAgfVxuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdGFyc1JhdGluZ0tleWRvd25IYW5kbGVyKGV2dCkge1xuXG4gIHZhciB2YWx1ZVRleHRzID0gWyd6ZXJvIHN0YXJzJywgJ29uZSBzdGFyJywgJ3R3byBzdGFycycsICd0aHJlZSBzdGFycycsICdmb3VyIHN0YXJzJywgJ2ZpdmUgc3RhcnMnXTtcbiAgdmFyIGVsZW0gPSBldnQudGFyZ2V0O1xuICBzd2l0Y2goZXZ0LmtleUNvZGUpIHtcblxuICAgIC8vIEFycm93IExFRlQvRE9XTlxuICAgIGNhc2UgMzc6XG4gICAgY2FzZSA0MDpcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdmFyIHZhbHVlID0gKHBhcnNlSW50KGVsZW0uZ2V0QXR0cmlidXRlKCdhcmlhLXZhbHVlbm93JykpLTEpOyAvLyAwLTUgdmFsdWVzXG4gICAgICBpZih2YWx1ZSA8IDApIHtcbiAgICAgICAgdmFsdWUgPSA1O1xuICAgICAgfSBcbiAgICAgIGVsZW0uc2V0QXR0cmlidXRlKCdhcmlhLXZhbHVlbm93JywgdmFsdWUpO1xuICAgICAgZmlsbFN0YXJzKGVsZW0pO1xuICAgICAgYnJlYWs7XG5cbiAgICAvLyBBcnJvdyBSSUdIVC9VUFxuICAgIGNhc2UgMzg6XG4gICAgY2FzZSAzOTpcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdmFyIHZhbHVlID0gKHBhcnNlSW50KGVsZW0uZ2V0QXR0cmlidXRlKCdhcmlhLXZhbHVlbm93JykpKzEpJTY7IFxuICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVub3cnLCB2YWx1ZSk7XG4gICAgICBlbGVtLnNldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZXRleHQnLCB2YWx1ZVRleHRzW3ZhbHVlXSk7XG4gICAgICBmaWxsU3RhcnMoZWxlbSk7XG4gICAgICBicmVhaztcblxuICB9XG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0YXJzUmF0aW5nSG92ZXJIYW5kbGVyKGV2dCkge1xuXG4gIHZhciBlbGVtID0gZXZ0LnRhcmdldC5wYXJlbnRFbGVtZW50O1xuICB2YXIgaSA9IEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoZWxlbS5jaGlsZHJlbiwgZXZ0LnRhcmdldCk7XG4gIGVsZW0uc2V0QXR0cmlidXRlKCdhcmlhLXZhbHVlbm93JywgaSsxKTtcbiAgZmlsbFN0YXJzKGVsZW0pO1xufVxuXG5mdW5jdGlvbiBmaWxsU3RhcnMoZWxlbSkge1xuICB2YXIgdmFsdWUgPSBlbGVtLmdldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZW5vdycpO1xuICBmb3IodmFyIGk9MDsgaSA8IGVsZW0uY2hpbGRyZW4ubGVuZ3RoOyBpKyspe1xuICAgICBlbGVtLmNoaWxkcmVuW2ldLmNsYXNzTmFtZSA9ICdmYSBmYS1zdGFyICcgKyBzdGFyVHlwZShpKzEsIHZhbHVlKTtcbiAgfVxufVxuXG4vKlxuICBBdmVyYWdlIG9mIGFuIGFycmF5IG9mIG51bWJlcnNcbiovXG5mdW5jdGlvbiBhdmcoYXJyYXkpIHtcbiAgcmV0dXJuIGFycmF5LnJlZHVjZSgocHJldiwgY3VyKSA9PiBwcmV2ICsgY3VyLCAwKS9hcnJheS5sZW5ndGg7XG59XG5cbi8qXG4gIENhbGN1bGF0ZSBob3cgZnVsbCBpcyB0aGUgY3VycmVudCBzdGFyXG4qL1xuZnVuY3Rpb24gc3RhclR5cGUob3JkZXIsIG51bWJlcikge1xuXG4gIGlmKG51bWJlciAtIG9yZGVyID09IC0wLjUpIHtcbiAgICByZXR1cm4gJ2hhbGYnO1xuICB9IGVsc2UgaWYobnVtYmVyIC0gb3JkZXIgPj0gMCkge1xuICAgIHJldHVybiAnZnVsbCdcbiAgfVxuXG4gIHJldHVybiAnZW1wdHknO1xuXG59XG4iLCJcbmV4cG9ydCBmdW5jdGlvbiBodG1sVG9FbGVtZW50KGh0bWwpIHtcbiAgICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IGh0bWw7XG4gICAgcmV0dXJuIHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RDaGlsZDtcbn1cblxuLypcbiAgU2VsZWN0cyB0aGUgYnJvd3NlciB0cmFuc2l0aW9uIGV2ZW50LCBmcm9tOlxuICBodHRwczovL2Rhdmlkd2Fsc2gubmFtZS9jc3MtYW5pbWF0aW9uLWNhbGxiYWNrXG4qL1xuZXhwb3J0IGZ1bmN0aW9uIHdoaWNoVHJhbnNpdGlvbkV2ZW50KCl7XG4gICAgdmFyIHQ7XG4gICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZmFrZWVsZW1lbnQnKTtcbiAgICB2YXIgdHJhbnNpdGlvbnMgPSB7XG4gICAgICAndHJhbnNpdGlvbic6J3RyYW5zaXRpb25lbmQnLFxuICAgICAgJ09UcmFuc2l0aW9uJzonb1RyYW5zaXRpb25FbmQnLFxuICAgICAgJ01velRyYW5zaXRpb24nOid0cmFuc2l0aW9uZW5kJyxcbiAgICAgICdXZWJraXRUcmFuc2l0aW9uJzond2Via2l0VHJhbnNpdGlvbkVuZCdcbiAgICB9XG5cbiAgICBmb3IodCBpbiB0cmFuc2l0aW9ucyl7XG4gICAgICAgIGlmKCBlbC5zdHlsZVt0XSAhPT0gdW5kZWZpbmVkICl7XG4gICAgICAgICAgICByZXR1cm4gdHJhbnNpdGlvbnNbdF07XG4gICAgICAgIH1cbiAgICB9XG59Il19
