'use strict';

(function() {
  let template = `
  <style>
  p {
    font-size: 16px;
    padding-left: 14px;
    padding-right: 14px;
    font-size: bold;
    line-height: 80%;
  }
  a {
    text-decoration: none;
  }
  div {
    box-shadow: 0 0 4px #000000;
    background-color: #d9d9d9;
    margin: 1%;
    position: relative;
    padding-bottom: 1px;
  }
  #id_heading {
    padding-top: 13px;
    font-size: 24px;
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
    }
    attachedCallback(){
      var self = this;
      this.anchor.href = "/Test="+this.getAttribute("id");
      this.anchor.onclick = function(event){
        App.navigate(event);
      }
      this.div.querySelector("#id_heading").innerHTML = "Test ID: <b>" + this.getAttribute("id")+"</b>";
      this.div.querySelector("#cattegory").innerHTML = "Test cattegory: <b>" + this.getAttribute("cattegory")+"</b>";
      this.div.querySelector("#date").innerHTML = "Added: <b>" + this.getAttribute("date")+"</b>";
      this.div.querySelector("#added_by").innerHTML = "Added by: <b>" + this.getAttribute("added_by")+"</b>";
      this.div.querySelector("#subject").innerHTML = "Name of tested subject: <b>" + this.getAttribute("subject")+"</b>";
    }
  }
  document.registerElement('test-component', TestComponent);
})();
