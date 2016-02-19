'use strict';

(function() {
  let template = `
  <style>
  p {
    font-size: 15px;
    padding-left: 14px;
    padding-right: 14px;
    font-size: bold;
    line-height: 70%;
  }
  a {
    text-decoration: none;
  }
  a: hover{
    color: yellow;
  }
  div: hover{
    background-color: black;
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
    font-size: 19px;
    font-size: bolder;
  }
  </style>
    <div>
    <a>
      <p id="name"></p>
      <p id="addedBy"></p>
      <p id="uploaded"></p>
      <p id="lastModified"></p>
      <p id="numSegments"></p>
      </a>
    </div>
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
      this.div.querySelector("#addedBy").innerHTML = "Added by: <b>" + this.getAttribute("addedBy")+"</b>";
      this.div.querySelector("#uploaded").innerHTML = "Uploaded: <b>" + this.getAttribute("uploaded")+"</b>";
      this.div.querySelector("#lastModified").innerHTML = "Last modified: <b>" + this.getAttribute("lastModified")+"</b>";
      this.div.querySelector("#numSegments").innerHTML = "Amount of segments: <b>" + this.getAttribute("numSegments")+"</b>";
    }
  }
  document.registerElement('test-component', TestComponent);
})();
