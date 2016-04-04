'use strict';

(function() {
  let template = `
  <style>
  h3 {
    color: black;
    font-size: 16px;
    padding-left: 15px;
    font-weight: bold;
    line-height: 0%;
  }
  a {
    text-decoration: none;
  }
  #wrapper {
    box-shadow: 0 0 4px #000000;
    background-color: #d9d9d9;
    margin: 1%;
    position: relative;
    padding-bottom: 0.5%;
    padding-top: 1%;
    position: relative;
    overflow: auto;
  }
  #error{
    color: red;
    font-weight: bolder;
    font-size: 16px;
    padding: 20px 15px 0px 15px;
  }
  button{
    box-shadow: 0 0 2px #000000;
    padding: 0.4em;
    font-weight: bold;
    font-size: 14px;
  }
  #controls {
    margin: 11px 10px 8px 14px;
  }
  p{
    margin-left: 15px;
    font-weight: bold;
    font-size: 15px;
    color: grey
  }
  input[type="text"] {
    margin-left: 15px;
    padding: 0.2em;
    font-weight: bold;
    font-size: 14px;
    color: grey;
    width: 300px;
  }
  #details {
    float: right;
    width: 50%;
  }
  img {
    float: left;
    margin: 1%;
    margin-left: 1.5%;
  }
  </style>
  <div id="wrapper">
    <img id="img_fragment"></img>
    <div id="details">
      <h3>Name: </h3>
      <p id="name" type="text"></p>
      <h3>Added by: </h3>
      <p id="added_by" type="text"></p>
      <h3>Uploaded: </h3>
      <p id="uploaded" type="text"></p>
      <h3>Last Modified: </h3>
      <p id="last_modified" type="text"></p>
      <div id="controls">
        <button id="view_details">View details</button>
        <button id="delete">Delete</button>
        <button id="edit">Edit</button>
        <button id="add_new_segment">Add new segment</button>
      </div>
    </div>
  </div>
  `;

  class TestComponent extends HTMLElement {
    createdCallback() {
      this.createShadowRoot().innerHTML = template;
      this.div = this.shadowRoot.querySelector("div");
      this.anchor = this.shadowRoot.querySelector('a');
    }
    attachedCallback() {
      this.name = this.getAttribute("name");
      this.addedBy = this.getAttribute("added_by");
      this.uploaded = parseDate(this.getAttribute("uploaded")).toLocaleString();
      this.lastModified = parseDate(this.getAttribute("last_modified")).toLocaleString();
      this.setAttribute("id", `test-${this.name}`);
      let img = this.shadowRoot.getElementById("img_fragment");
      img.src = `/data/tests/${this.name}/frame.jpeg`
      img.width = '370';
      img.height = '240';

      this.shadowRoot.querySelector("#name").innerHTML = this.name;
      this.shadowRoot.querySelector("#added_by").innerHTML = this.addedBy;
      this.shadowRoot.querySelector("#uploaded").innerHTML = this.uploaded;
      this.shadowRoot.querySelector("#last_modified").innerHTML = this.lastModified;
      var self = this;
      this.shadowRoot.getElementById("delete").onclick = function(event){
        self.delete();
      }
      this.shadowRoot.getElementById("edit").onclick = function(event){
        self.edit();
      }
      this.shadowRoot.getElementById("view_details").onclick = function(event){
        self.viewDetails();
      }
      this.shadowRoot.getElementById("add_new_segment").onclick = function(event){
        self.addNewSegment();
      }
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
      if (attrName == "name"){
        this.name = newVal;
        this.shadowRoot.querySelector("#name").innerHTML = `<b>${this.name}</b>`;
      } else if (attrName == "addedBy"){
        this.addedBy = newVal;
        this.shadowRoot.querySelector("#added_by").innerHTML = `<b>${this.addedBy}</b>`;
      } else if (attrName == "uploaded"){
        this.uploaded = newVal;
        this.shadowRoot.querySelector("#uploaded").innerHTML = `<b>${this.uploaded}</b>`;
      } else if (attrName == "lastModified"){
        this.lastModified = newVal;
        this.shadowRoot.querySelector("#last_modified").innerHTML = `<b>${this.lastModified}</b>`;
      }
    }

    delete(){
      var self = this;
      App.deleteData({
        dataName: "TestData",
        key: self.name,
        success: function(){
          self.remove();
        },
        error: function() {
          self.deleteError()
        }
      })
    }

    viewDetails(){
      App.navigate(`/Test/${this.name}`);
    }

    addNewSegment(){
      App.navigate(`/NewSegment/${this.name}`);
    }

    edit(){
      let name = this.shadowRoot.getElementById("name");
      let addedBy = this.shadowRoot.getElementById("added_by");
      let editableName = document.createElement('input');
      editableName.value = this.name;
      editableName.type = 'text';
      editableName.id = name.id;
      let editableAddedBy = document.createElement('input');
      editableAddedBy.value = this.addedBy;
      editableAddedBy.type = 'text';
      editableAddedBy.id = addedBy.id;
      name.parentNode.replaceChild(editableName, name);
      addedBy.parentNode.replaceChild(editableAddedBy, addedBy);
      let edit = this.shadowRoot.getElementById("edit");
      let ok = document.createElement('button');
      ok.id = 'ok';
      ok.innerHTML = 'Ok'
      var self = this;
      ok.onclick = function(){
        self.ok()
      }
      edit.parentNode.replaceChild(ok, edit);
    }

    ok(){
      let editableName = this.shadowRoot.getElementById("name");
      let editableAddedBy = this.shadowRoot.getElementById("added_by");
      this.name = editableName.value;
      this.addedBy = editableAddedBy.value;

      let name = document.createElement('p');
      name.innerHTML = this.name;
      name.id = 'name';
      let addedBy = document.createElement('p');
      addedBy.innerHTML = this.addedBy;
      addedBy.id = 'added_by'
      editableName.parentNode.replaceChild(name, editableName);
      editableAddedBy.parentNode.replaceChild(addedBy, editableAddedBy);

      let ok = this.shadowRoot.getElementById("ok");
      let edit = document.createElement('button');
      edit.innerHTML = 'Edit'
      edit.id = 'edit';
      var self = this;
      edit.onclick = function(){
        self.edit()
      }
      ok.parentNode.replaceChild(edit, ok);
    }

    deleteError(){
      let p = document.createElement("p");
      p.id = this.getAttribute("id") + "-error";
      p.innerHTML = 'Error deleting test from database';
      let wrapper = this.shadowRoot.getElementById("wrapper");
      wrapper.insertBefore(p, wrapper.firstChild);
    }
  }
  document.registerElement('test-component', TestComponent);
})();
