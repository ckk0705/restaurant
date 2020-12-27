import * as Util from './util.js';
import * as Stars from './stars.js';

const focusableElementsString = 'a[href], [role="slider"], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';

var wrapper, modal, overlay, submitButton, closeButton, focusedElementBeforeModal;

export function openModal(restaurant) {

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
  window.requestAnimationFrame(function(){
    modal.className = 'show';
  });
  wrapper.setAttribute('aria-hidden', true);

  closeButton.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  submitButton.addEventListener('click', submitReview(restaurant));
  Stars.addListeners(); 

  // Add keyboard listener to create the focus-trap
  var {firstElement, lastElement} = findFocusLimitElements(modal);
  modal.addEventListener('keydown', focusTrapController(firstElement, lastElement));

}

export function closeModal() {

  wrapper.removeAttribute('aria-hidden');
  modal.className = '';
  
  var transitionEvent = Util.whichTransitionEvent();
  transitionEvent && modal.addEventListener(transitionEvent, removeModal);

}

function submitReview(restaurant) {

  return function(){

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

  return function(evt) {
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
  return `<div id="modal" role="dialog" aria-labelledby="modal-title" hidden>
            <div id="overlay"></div>
            <div id="dialog">
              <header>
                <h3 id="modal-title">${restaurant.name}</h3>
              </header>
              <div class="content">
                ${reviewsTmpl(restaurant.reviews)}
                <div class="new-review">
                  <form aria-labelledby="form-title">
                    <h3 id="form-title">Add your review</h3>
                    ${Stars.starsRating()}
                    <input id="review-name" 
                           type="text" 
                           name="name" 
                           placeholder="Your name"
                           aria-label="Your name"
                           autocomplete="name">
                    <textarea id="comment" 
                              name="comment"
                              aria-label="Comment" 
                              placeholder="Tell something about your experience in this restaurant."></textarea>
                  </form>
                </div>
              </div>
              <footer>
                <input id="add-review" type="button" name="addReview" value="Submit">
                <input id="close-modal" type="button" name="closeModal" value="Close">
              </footer>
            </div>
          </div>`;
}

function reviewsTmpl(reviews) {

  return reviews.map(reviewTmpl).join('');

}

function reviewTmpl(review) {

  var date = new Date(parseInt(review.created_at));
  return `<div class="review">
            <p class="author">
              ${Stars.starsTmpl(review.stars)}
              <span>by ${review.name} on ${date.toLocaleString()}</span>              
            </p>
            <p class="comment">
              ${review.comment}
            </p>
          </div>`;

}