'use strict';

(function() {
  let template = `
  <style>
  p {
    font-size: 18px;
    padding-left: 14px;
    padding-right: 14px;
    font-size: bold;
  }
  a {
    text-decoration: none;
  }
  div {
    box-shadow: 0 0 4px #000000;
    background-color: #d9d9d9;
    margin: 1%;
  }
  #id_heading {
    font-size: 28px;
    font-size: bolder;
  }
  </style>
  <a>
    <div>
      <p id="id_heading"></p>
      <p id="cattegory"></p>
      <p id="date"></p>
      <p id="added_by"></p>
      <p id="subject"></p>
    </div>
  </a>
  `;

  class TestComponent extends HTMLElement {
    createdCallback() {
      this.createShadowRoot().innerHTML = template;
      this.anchor = this.shadowRoot.querySelector('a');
      this.div = this.shadowRoot.querySelector('div');
      var self = this;
      this.anchor.onclick = function(event){
        alert(event.target.href);
        App.navigate(event, true);
      }
    }
    attributeChangedCallback(attrName, oldVal, newVal) {
      if (attrName == "id"){
        this.anchor.setAttribute("href", "/"+newVal);
        this.div.querySelector("#id_heading").innerHTML = newVal;
      }
      if (attrName == "cattegory"){
        this.div.querySelector("#cattegory").innerHTML = newVal;
      }
      if (attrName == "date"){
        this.div.querySelector("#date").innerHTML = newVal;
      }
      if (attrName == "added_by"){
        this.div.querySelector("#added_by").innerHTML = newVal;
      }
      if (attrName == "subject"){
        this.div.querySelector("#subject").innerHTML = newVal;
      }
    }
  }
  document.registerElement('test-component', TestComponent);
})();
