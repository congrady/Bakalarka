'use strict';

(function() {
  let template = `
  <style>
  p {
    color: black;
    font-size: 15px;
    padding-left: 14px;
    padding-right: 14px;
    font-size: bold;
    line-height: 70%;
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
    padding-top: 14px;
    font-size: 20px;
    font-size: bolder;
  }
  #error{
    color: red;
    font-weight: bolder;
    font-size: 16px;
    padding: 20px 15px 0px 15px;
  }
  button{
    box-shadow: 0 0 3px #000000;
    padding: 0.4em;
    margin: 5px 10px 10px 10px;
    font-weight: bold;
    font-size: 15px;
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
    <button>Delete</button>
  </div>
  `;

  class TestComponent extends HTMLElement {
    createdCallback() {
      this.createShadowRoot().innerHTML = template;
      this.div = this.shadowRoot.querySelector("div");
    }
    setData(data){
      this.data = data;
      var self = this;
      this.setAttribute("id", `test-${this.data.name}`);
      let anchor = this.shadowRoot.querySelector('a');
      anchor.href = "/Test/"+encodeURIForUser(this.data.name);
      anchor.onclick = function(event){
        App.navigate(event);
      }
      let div = this.shadowRoot.querySelector('div');
      this.shadowRoot.querySelector("#name").innerHTML = `<b>${this.data.name}</b>`;
      this.shadowRoot.querySelector("#addedBy").innerHTML = `Added by: <b>${this.data.added_by}</b>`;
      this.shadowRoot.querySelector("#uploaded").innerHTML = `Uploaded: <b>${this.data.uploaded}</b>`;
      this.shadowRoot.querySelector("#lastModified").innerHTML = `Last Modified: <b>${this.data.last_modified}</b>`;
      this.shadowRoot.querySelector("button").onclick = function(event){
        self.delete();
      }
    }

    delete(){
      var self = this;
      App.deleteData({
        dataName: "TestData",
        table: "tests",
        key: self.data.name,
        success: function(){
          App.deleteClientData({
            dataName: "TestData",
            key: self.data.name,
          });
          self.remove();
        },
        error: function() { self.deleteError() }
      })
    }

    deleteError(){
      let p = document.createElement("p");
      p.id = "error"
      p.innerHTML = 'Error deleting test from database';
      let anchor = this.shadowRoot.querySelector("a");
      anchor.insertBefore(p, anchor.firstChild);
    }
  }
  document.registerElement('test-component', TestComponent);
})();
