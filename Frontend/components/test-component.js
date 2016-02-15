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
  #name {
    padding-top: 13px;
    font-size: 24px;
    font-size: bolder;
  }
  </style>
  <a>
    <div>
      <p id="name"></p>
      <p id="numSegments"></p>
      <p id="uploaded"></p>
      <p id="uploadedBy"></p>
      <p id="lastModified"></p>
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
      this.anchor.href = "/Test="+encodeURIWithSlashes(this.getAttribute("name"));
      this.anchor.onclick = function(event){
        App.navigate(event);
      }
      this.div.querySelector("#name").innerHTML = "<b>" + this.getAttribute("name")+"</b>";
      this.div.querySelector("#numSegments").innerHTML = "Amount of segments: <b>" + this.getAttribute("numSegments")+"</b>";
      this.div.querySelector("#uploaded").innerHTML = "Uploaded: <b>" + this.getAttribute("uploaded")+"</b>";
      this.div.querySelector("#uploadedBy").innerHTML = "Uploaded by: <b>" + this.getAttribute("uploadedBy")+"</b>";
      this.div.querySelector("#lastModified").innerHTML = "Last modified: <b>" + this.getAttribute("lastModified")+"</b>";
    }
  }
  document.registerElement('test-component', TestComponent);
})();
