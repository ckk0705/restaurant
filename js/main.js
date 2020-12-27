import * as App from './app.js';

(function() {

  function ready() {
      
    return new Promise(function(resolve, reject) {
      
      // resolve the promise when the document is ready
      document.addEventListener('readystatechange', function() {
        if(document.readyState !== 'loading') {
          resolve();
        }
      });

    });

  };

  ready().then(function() {
    App.init();

    // add filtering listeners
    var typeButtons = document.getElementsByName('type');
    for(var i=0; i < typeButtons.length; i++) {
      typeButtons[i].addEventListener('change', function(){

        App.filterByType(this.value);

      });
    }

    // Add input listener for the search box, we want to update
    // the list on each keystroke (the list is already completely 
    // loaded so this doesn't make more requests)
    var nameFilter = document.getElementById('searchbox');
    nameFilter.addEventListener('input', function() {

      App.filterByName(this.value);

    });

  });

})();