'use strict';

(function() {
  let template = `
    <style>
    nav a{
      padding-left: 5%;
      padding-right: 5%;
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
      width: 23.33%;
      height: 100%;
      text-align: center;
      line-height: 45px;
    }
    a:hover {
      background-color: #fff;
      color: #404040;
    }
    nav {
      height: 45px;
      background-color: #404040;
      box-shadow: 0 0 10px #000000;
    }
    </style>
    <nav></nav>
  `;
  class MainNavigation extends HTMLElement {
    createdCallback() {
      this.createShadowRoot().innerHTML = template;
      this.$nav = this.shadowRoot.querySelector('nav');
      for (let path of router.navigationPaths){
          var anchor = document.createElement("a");
          anchor.innerHTML = path.substring(1);
          anchor.href = path;
          anchor.onclick = window["navigate"];
          this.$nav.appendChild(anchor);
      }
    };
  }
  document.registerElement('main-navigation', MainNavigation);
})();
