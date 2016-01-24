'use strict';

(function() {
  let template = `
    <style>
    a{
      text-shadow:
        -0.5px -0.5px 0 #000,
        0.5px -0.5px 0 #000,
        -0.5px 0.5px 0 #000,
        0.5px 0.5px 0 #000;
      color: #fff;
      text-decoration: none;
      font-weight: bold;
      display: block;
      float: left;
      height: 100%;
      text-align: center;
      line-height: 45px;
      box-shadow: -0.7px 0px 0.7px 0.7px #666666;
    }
    .active {
      background-color: #fff;
      color: #404040;
      text-shadow: none;
    }
    a:hover {
      background-color: #fff;
      color: #404040;
      text-shadow: none;
      -moz-box-shadow:    inset 0 0 2px #000000;
      -webkit-box-shadow: inset 0 0 2px #000000;
      box-shadow:         inset 0 0 2px #000000;
    }
    nav {
      overflow: hidden;
      height: 45px;
      background-color: #333333;
      box-shadow: 0 0 4px #000000;
      margin-top: 0.4%;
      border-radius: 5px;
    }
    </style>
    <nav></nav>
  `;
  class MainNavigation extends HTMLElement {
    createdCallback() {
      this.createShadowRoot().innerHTML = template;
      this.$nav = this.shadowRoot.querySelector('nav');
      let width = (100/App.router.navigationPaths.length) + "%";
      var self = this;
      let currentPage = App.router.currentPage;
      for (let path of App.router.navigationPaths){
          var anchor = document.createElement("a");
          if (path.substring(1) == currentPage){
            anchor.classList.add("active");
          }
          anchor.innerHTML = path.substring(1);
          anchor.href = path;
          anchor.style.width = width;
          anchor.onclick = function(event){
            App.navigate(event);
            let current = self.shadowRoot.querySelector(".active");
            current.classList.remove("active");
            event.target.classList.add("active");
          }
          this.$nav.appendChild(anchor);
      }
    }
  }
  document.registerElement('main-navigation', MainNavigation);
})();
