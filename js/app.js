import * as Modal from './modal.js';
import * as Util from './util.js';
import * as Stars from './stars.js';

// module variables, used to filter the restaurants by name and type
var restaurants, 
typeSelected = '', 
searchString = '';

/* 
  Initialize the application loading the restaurants data 
  and adding the event listeners to the interactive elements.
*/
export function init() {

  fetch('data/restaurants.json')
    .then(response => response.json())
    .then(storeRestaurants)
    .then(showRestaurants)
    .catch(function(error) {
      console.error('Could not load the restaurants.', error);
    });

}

export function filterByType(type) {

  typeSelected = type;
  showRestaurants(filterRestaurants());

}

export function filterByName(name) {
  
  searchString = name;
  showRestaurants(filterRestaurants());

}

export function filterRestaurants() {

  return restaurants.filter((restaurant) => {
    
    var containsSearchString = true, 
    isTypeSelected = true;
    
    if(searchString != '') {
  
      containsSearchString = restaurant.name.indexOf(searchString) != -1;
  
    } 

    if(typeSelected != ''){

      isTypeSelected = (restaurant.type === typeSelected);

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
  restaurants.forEach((restaurant) => {

    var restaurantElem = Util.htmlToElement(restaurantTmpl(restaurant));
    var button = restaurantElem.querySelector('.reviews-button');

    button.addEventListener('click', function(){
      return Modal.openModal(restaurant);
    });

    restaurantsList.appendChild(restaurantElem);

  });

}

//---------- Templates ---------------
function restaurantTmpl(restaurant) {

  return `<article class="row" aria-label="${restaurant.name} ${Stars.calculateStars(restaurant.reviews)} stars">
            <h2>
              ${restaurant.name}
              ${Stars.starsTmpl(Stars.calculateStars(restaurant.reviews))}
            </h2>
            <div class="thumb">
              <img src="${restaurant.photo}" alt="${restaurant.name} Photograph">
            </div>
            <div class="location">
              <span class="sr-only">Location:</span>
              <span class="fa fa-map-marker" aria-hidden="true"></span> 
              <span>${restaurant.address}</span>
              <a class="maps" href="${mapsLink(restaurant.address)}" target="_blank">Open in Maps</a>
            </div>
            <div class="opening">
              Opens: ${openingTmpl(restaurant.openingHours)} 
            </div>
            <div class="description">
              ${restaurant.description}
            </div>
            <input class="reviews-button" type="button" value="${restaurant.reviews.length} reviews - Add your review"/>
          </article>`;

}

function openingTmpl(openingHours) {

  return openingHours.map(timeTmpl).join(' | ');

}

function timeTmpl(time) {

  return `<span class="text-success">${time.open} - ${time.close}</span>`;

}

function mapsLink(address) {

  return `http://maps.google.com/?q=${encodeURIComponent(address)}`;

}
