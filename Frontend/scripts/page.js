'use strict';

class Page {
  constructor(params) {
    this.title = params.title;
    this.elements = {};
  }

  show() {
    document.getElementsByTagName('title')[0].innerHTML = this.title;
    var mainContent = document.getElementById("main-content");
    while (mainContent.lastChild) {
      mainContent.removeChild(mainContent.lastChild);
    }
    for (let element of elements){
      mainContent.appendChild(element);
    }
  }
}
