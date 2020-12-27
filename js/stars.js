/*
  Calculate the average from all stars in the reviews
*/
export function calculateStars(reviews) {

  var stars = reviews.map((review) => review.stars);
  return avg(stars) ;

}

export function starsTmpl(number) {

  return `<div class="stars">
            <span class="sr-only">${number} stars</span>
            <i class="fa fa-star ${starType(1, number)}" aria-hidden="true"></i>
            <i class="fa fa-star ${starType(2, number)}" aria-hidden="true"></i>
            <i class="fa fa-star ${starType(3, number)}" aria-hidden="true"></i>
            <i class="fa fa-star ${starType(4, number)}" aria-hidden="true"></i>
            <i class="fa fa-star ${starType(5, number)}" aria-hidden="true"></i>
          </div>`;

}

export function starsRating() {

  return `<div id="stars-rating" 
               role="slider"
               tabindex="0"
               aria-label="Please select a number of stars" 
               aria-live="polite"
               aria-valuemin="0"
               aria-valuemax="5"
               aria-valuenow="0"
               aria-valuetext="zero">
            <i class="fa fa-star empty" aria-hidden="true"></i>
            <i class="fa fa-star empty" aria-hidden="true"></i>
            <i class="fa fa-star empty" aria-hidden="true"></i>
            <i class="fa fa-star empty" aria-hidden="true"></i>
            <i class="fa fa-star empty" aria-hidden="true"></i>
          </div>`;
}

export function addListeners() {

  var starsRating = document.getElementById('stars-rating');
  
  starsRating.addEventListener('keydown', starsRatingKeydownHandler);

  for(var i=0; i < starsRating.children.length; i++) {
    starsRating.children[i].addEventListener('mouseover', starsRatingHoverHandler);
  }

}

export function starsRatingKeydownHandler(evt) {

  var valueTexts = ['zero stars', 'one star', 'two stars', 'three stars', 'four stars', 'five stars'];
  var elem = evt.target;
  switch(evt.keyCode) {

    // Arrow LEFT/DOWN
    case 37:
    case 40:
      evt.preventDefault();
      var value = (parseInt(elem.getAttribute('aria-valuenow'))-1); // 0-5 values
      if(value < 0) {
        value = 5;
      } 
      elem.setAttribute('aria-valuenow', value);
      fillStars(elem);
      break;

    // Arrow RIGHT/UP
    case 38:
    case 39:
      evt.preventDefault();
      var value = (parseInt(elem.getAttribute('aria-valuenow'))+1)%6; 
      elem.setAttribute('aria-valuenow', value);
      elem.setAttribute('aria-valuetext', valueTexts[value]);
      fillStars(elem);
      break;

  }

}

export function starsRatingHoverHandler(evt) {

  var elem = evt.target.parentElement;
  var i = Array.prototype.indexOf.call(elem.children, evt.target);
  elem.setAttribute('aria-valuenow', i+1);
  fillStars(elem);
}

function fillStars(elem) {
  var value = elem.getAttribute('aria-valuenow');
  for(var i=0; i < elem.children.length; i++){
     elem.children[i].className = 'fa fa-star ' + starType(i+1, value);
  }
}

/*
  Average of an array of numbers
*/
function avg(array) {
  return array.reduce((prev, cur) => prev + cur, 0)/array.length;
}

/*
  Calculate how full is the current star
*/
function starType(order, number) {

  if(number - order == -0.5) {
    return 'half';
  } else if(number - order >= 0) {
    return 'full'
  }

  return 'empty';

}
