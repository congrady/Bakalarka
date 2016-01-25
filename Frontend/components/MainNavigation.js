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
      if (App.authenticator.userName){
        this.setAttribute("mode", "auth");
      }
      else {
        this.setAttribute("mode", "free");
      }
    }
    attributeChangedCallback(attrName, oldVal, newVal) {
      if (attrName == "mode"){
        this.makeNavigation(newVal);
      }
      if (attrName == "active"){
        this.shadowRoot.querySelector("#"+oldVal).classList.remove("active");
        this.shadowRoot.querySelector("#"+newVal).classList.add("active");
      }
    }
    makeNavigation(mode){
      this.$nav.innerHTML = "";
      var self = this;
      let currentPage = App.router.currentPage;
      let navigation = [];
      if (mode == "free"){
        for (let path of App.router.navigationPaths){
          if (!App.router.needAuthentication.has(path.substring(1))){
            navigation.push(path);
          }
        }
      }
      else if (mode == "auth"){
        for (let path of App.router.navigationPaths){
          navigation.push(path);
        }
      }
      let width = (100/navigation.length) + "%";
      for (let path of navigation){
        let anchor = path.substring(1);
        let $anchorElement = document.createElement("a");
        if (anchor == currentPage){
          $anchorElement.classList.add("active");
        }
        $anchorElement.innerHTML = anchor;
        $anchorElement.id = anchor;
        $anchorElement.href = path;
        $anchorElement.style.width = width;
        $anchorElement.onclick = function(event){
          App.navigate(event);
        }
        this.$nav.appendChild($anchorElement);
      }
    }
  }
  document.registerElement('main-navigation', MainNavigation);
})();
