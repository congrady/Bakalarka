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
    margin: 1.5%;
    margin-left: 2%;
  }
  </style>
  <div id="wrapper">
    <img id="img_fragment"></img>
    <div id="details">
      <div id="editable">
        <h3>Name: </h3>
        <p id="name"></p>
        <h3>Added by: </h3>
        <p id="added_by"></p>
      </div>
      <h3>Added: </h3>
      <p id="uploaded"></p>
      <h3>Last Modified: </h3>
      <p id="last_modified"></p>
      <h3>Amount of Segments: </h3>
      <p id="segments_amount"></p>
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
      this.div = this.shadowRoot.querySelector('div');
      this.anchor = this.shadowRoot.querySelector('a');
    }
    attachedCallback() {
      this.name = this.getAttribute('name') ? this.getAttribute('name') : 'loading...';
      this.addedBy = this.getAttribute('added_by') ? this.getAttribute('added_by') : 'loading...';
      this.uploaded = this.getAttribute('uploaded') ? parseDate(this.getAttribute('uploaded')).toLocaleString() : 'loading...';
      this.lastModified = this.getAttribute('last_modified') ?  parseDate(this.getAttribute('last_modified')).toLocaleString() : 'loading...';
      this.segmentsAmount = this.getAttribute('segments_amount') ? this.getAttribute('segments_amount') : 'loading...';
      this.realID = this.id.slice(1, this.id.length);

      let img = this.shadowRoot.getElementById('img_fragment');
      img.width = '375';
      img.height = '270';
      if (this.segmentsAmount == '0'){
        img.src = './client/assets/img/error.gif';
      } else {
        img.src = `/data/tests/${this.realID}/frame.jpeg`;
      }

      this.shadowRoot.getElementById('name').innerHTML = this.name;
      this.shadowRoot.getElementById('added_by').innerHTML = this.addedBy;
      this.shadowRoot.getElementById('uploaded').innerHTML = this.uploaded;
      this.shadowRoot.getElementById('last_modified').innerHTML = this.lastModified;
      this.shadowRoot.getElementById('segments_amount').innerHTML = this.segmentsAmount;

      var self = this;
      this.shadowRoot.getElementById('delete').onclick = function(event){
        self.delete();
      }
      this.shadowRoot.getElementById('edit').onclick = function(event){
        self.setEditMode();
      }
      this.shadowRoot.getElementById('view_details').onclick = function(event){
        self.viewDetails();
      }
      this.shadowRoot.getElementById('add_new_segment').onclick = function(event){
        self.addNewSegment();
      }
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
      if (attrName == 'name'){
        this.name = newVal;
        this.shadowRoot.getElementById('name').innerHTML = this.name;
      } else if (attrName == 'added_by'){
        this.addedBy = newVal;
        this.shadowRoot.getElementById('added_by').innerHTML = this.addedBy;
      } else if (attrName == 'uploaded'){
        this.uploaded = parseDate(newVal);
        this.shadowRoot.getElementById('uploaded').innerHTML = this.uploaded;
      } else if (attrName == 'last_modified'){
        this.lastModified = parseDate(newVal);
        this.shadowRoot.getElementById('last_modified').innerHTML = this.lastModified;
      } else if (attrName == 'segments_amount'){
        this.segmentsAmount = newVal;
        this.shadowRoot.getElementById('segments_amount').innerHTML = this.segmentsAmount;
      }
    }

    delete(){
      let confirmed = confirm('Are you sure you want to delete a test from database? This will remove all it\'s segments aswell');
      if (confirmed == true) {
        var self = this;
        App.deleteData({
          dataName: 'TestData',
          key: this.realID,
          success: function(){
            self.remove();
          },
          error: function() {
            self.error('Error deleting test from database.')
          }
        })
      }
    }

    viewDetails(){
      App.navigate(`/Test/${this.realID}`);
    }

    addNewSegment(){
      App.navigate(`/NewSegment/${this.realID}`);
    }

    setEditMode(){
      this.shadowRoot.getElementById('editable').innerHTML = `
        <form>
          <h3>Name: </h3>
          <input type="text" id="name" value="${this.name}"></p>
          <h3>Added by: </h3>
          <input type="text" id="added_by" value="${this.addedBy}"></p>
          <input type="submit" hidden>
        </form>
      `;
      let form = this.shadowRoot.querySelector('form');

      let edit = this.shadowRoot.getElementById('edit');
      let ok = document.createElement('button');
      ok.id = 'ok';
      ok.innerHTML = 'Ok'
      var self = this;
      form.onsubmit = function(event){
        event.preventDefault();
        self.confirmEdit({
          name: event.target.name.value,
          addedBy: event.target.added_by.value
        })
      }
      var self = this;
      ok.onclick = function(){
        let form = self.shadowRoot.querySelector('form');
        self.confirmEdit({
          name: form.name.value,
          addedBy: form.added_by.value
        })
      }
      edit.parentNode.replaceChild(ok, edit);
    }

    setNormalMode(){
      let normalTemplate = `<h3>Name: </h3>
                            <p id="name">${this.name}</p>
                            <h3>Added by: </h3>
                            <p id="added_by">${this.addedBy}</p>`;
      this.shadowRoot.getElementById('editable').innerHTML = normalTemplate;

      let ok = this.shadowRoot.getElementById('ok');
      let edit = document.createElement('button');
      edit.innerHTML = 'Edit'
      edit.id = 'edit';
      var self = this;
      edit.onclick = function(){
        self.setEditMode();
      }
      ok.parentNode.replaceChild(edit, ok);
    }

    confirmEdit(data){
      var self = this;
      App.updateData({
        dataName: 'TestData',
        key: this.realID,
        data: {
          name: data.name,
          added_by: data.addedBy
        },
        success: function(response){
          let updated = JSON.parse(response);
          for (let prop in updated){
            self.setAttribute(prop, updated[prop]);
          }
          self.setNormalMode();
        },
        error: function() {
          self.error('Error updating test in database.')
        }
      })
    }

    error(message){
      let p = document.createElement('p');
      p.id = this.getAttribute('id') + '-error';
      p.innerHTML = message;
      let wrapper = this.shadowRoot.getElementById('wrapper');
      wrapper.insertBefore(p, wrapper.firstChild);
    }
  }
  document.registerElement('test-component', TestComponent);
})();
