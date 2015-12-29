'use strict';

class Page2 extends PageView {
  cunstructor(urlParams) {
    this.title = "Page 2";
    this.root = document.createDocumentFragment();
    this.root.innerHTML = `
      <h3 id="page-title">$(this.title)<h3>
      <div id="main-div"></div>
    `;

    this.$mainDIV = document.getElementById("main-div");
    this.$mainUL = document.createElement("ul");
    for (let urlParam of urlParams){
      $li = document.createElement("li");
      $li.innerHTML = urlParam;
      $li.style.color = "blue";
      this.$mainUL.appendChild($li);
    }
    this.$mainDIV.appendChild($mainUL);
  };
}
