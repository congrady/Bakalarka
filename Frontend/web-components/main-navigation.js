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
      if (App.userName){
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
        let oldActive = this.shadowRoot.querySelector("#"+oldVal);
        if (oldActive){
          oldActive.classList.remove("active");
        }
        let newActive = this.shadowRoot.querySelector("#"+newVal);
        if (newActive){
          newActive.classList.add("active");
        }
      }
    }

    makeNavigation(mode){
      this.$nav.innerHTML = "";
      let currentPage = App.router.currentPage;
      let navigation = new Map();
      if (mode == "free"){
        for (let item of App.router.navigation){
          if(!App.router.needAuthentication.has(item[1].page)){
            navigation.set(item[0], item[1].navigation);
          }
        }
      }
      else if (mode == "auth"){
        for (let item of App.router.navigation){
          if (App.router.needAuthentication.get(item[0]) >= App.authLevel || !App.router.needAuthentication.has(item[0])){
            navigation.set(item[0], item[1].navigation);
          }
        }
      }
      let width = (100/navigation.size) + "%";
      for (let item of navigation){
        let path = item[0];
        let name = item[1];
        let $anchorElement = document.createElement("a");
        if (App.router.routes.get(path) == currentPage){
          $anchorElement.classList.add("active");
        }
        $anchorElement.innerHTML = name;
        $anchorElement.id = path.substring(1);
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