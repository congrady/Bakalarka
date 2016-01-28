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
    position:relative;
  }
  #id_heading {
    font-size: 28px;
    font-size: bolder;
  }
  #cattegory {
    position:absolute;
    top: 5;
    left: 5
  }
  #date {
    position:absolute;
    top: 5;
    right: 5
  }
  #added_by {
    position:absolute;
    bottom: 5;
    left: 5
  }
  #subject {
    position:absolute;
    bottom: 5;
    right: 5
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
    }
    attachedCallback(){
      var self = this;
      this.anchor.href = "/Test="+this.getAttribute("id");
      this.anchor.onclick = function(event){
        App.navigate(event);
      }
      this.div.querySelector("#id_heading").innerHTML = this.getAttribute("id");
      this.div.querySelector("#cattegory").innerHTML = this.getAttribute("cattegory");
      this.div.querySelector("#date").innerHTML = this.getAttribute("date");
      this.div.querySelector("#added_by").innerHTML = this.getAttribute("added_by");
      this.div.querySelector("#subject").innerHTML = this.getAttribute("subject");
    }
  }
  document.registerElement('test-component', TestComponent);
})();
