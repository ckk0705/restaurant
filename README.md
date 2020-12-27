# Restaurants

Restaurants reviews application with accesibility and responsiveness in mind.

This is an exercise build for Udacity Senior Web Developer Nanodegree program. I tried to build a 
good, responsive and accessible user experience using HTML5 semantic elements and ES6 without any JS or Styling Framework (No Bootstrap or AngularJS in this one).

* Created a custom component for the star rating using the aria "slider" role. 
* Tab behaviour is controlled inside modal windows to keep keyboard users inside the modal and aria atributes and semantic html are provided to give screen reader users enough context about the application interactions.

This was a very interesting exercise about user experience improvement for everyone. I love this topic and think that it is essencial that we give all users a good experience, even if they are using a mobile device, a screen reader, a keyboard or a mouse. 

My experience with this project is that it may take you a bit more to add keyboard interaction or to comply with WCAG, but all users get a better experience from the extra though and work that you put on the app: 

- Semantic html means that your code improves in readability, so experience is also better for developers.
- Keyboard interaction improves the experience for all users and 
- Responsiveness makes your app look better on every device so you don't have to redirect your mobile and tablet users to download a native app to do the same tasks that they'd do on the web. 

Accessibility is a must for apps that aim to deliver a great user experience and want to reach a broad audience. More info in A11y:

[Udacity Web Accessibility free online course by Google](https://www.udacity.com/course/web-accessibility--ud891)

[Introduction to web accessibility](http://webaim.org/intro/)

[WAI-ARIA Authoring practices](https://www.w3.org/TR/2016/WD-wai-aria-practices-1.1-20160317/)

[thea11yproject](http://a11yproject.com/)

[Microsoft Inclusive Design Toolkit](https://www.microsoft.com/en-us/design/practice#toolkit)

[CSS with A11Y in mind](https://medium.com/@matuzo/writing-css-with-accessibility-in-mind-8514a0007939)

## Install

To install and run the local server you have to run this commands:

    $> git clone https://github.com/juanmirod/restaurants
    $> npm install
    $> gulp serve

This last command should launch the browser and open the app at `localhost:3030/` Enjoy!

To serve minimized files use `gulp serve:dist` instead.
