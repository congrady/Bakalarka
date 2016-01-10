# Bakalárka - UXP data processing

Project will be based on currently developed framewrok (for now without it's own name).

Framework serves for creating SPAs - Single Page Applications.

Features:

1. Based entirely on native Javascript, and new ES6 features. No external dependencies.

2. Integrated web components http://webcomponents.org/

3. Amazingly fast. Everything is developed with performance as a first concern.

4. Authentication based on a new JWT standard - JSON web tokens. https://en.wikipedia.org/wiki/JSON_Web_Token

5. History API routing

6. Asynchronous on-demand resource loading.

7. You CAN use external libraries. Just specify them in config file, and they will load automatically.


Disadvantages:

1. No support for older browsers (IE 8).

2. Web components are not supported in all browsers. They are available for Chrome and Opera, for Mozilla with flag. Safari and Edge support was announced, and is currently under development. For now, if you need to target all browsers, you can use polyfill http://webcomponents.org/polyfills/

-------------------------------------------------------
Application structure

As I mentioned above, frontend is purely javascript. Backend is based on golang https://golang.org/  

#Backend

**main.go**
Backend routing:
1. Serves static files  
2. Handles authentication 
3. For all other request, responds with index.html - the actual application routing itself is made on frontend 

#Frontend

**css**

Contains globalStyle.css file - Default elements style (doesn't apply on webcomponents, that have their own style that lives in their shadow DOM)

**data**

Contains static data. Videos, Texts and Audio

**components**

Contains .js files with webcomponents. 1 file for 1 webcomponent.

**pages**

Contains .js files that represent page itself. Views (or viewmodels) are webcomponents-like. They contain in-line html template strings. You can store templates in a separate file (todo) if you wish to.

**scripts**

For now, contains scripts for framework itself. In the future, those scripts will be merged and minified, and this folder will contain external scripts. (In the case you want to store them locally, not using cdn).
