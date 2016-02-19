'use strict';

App.newPage({
  title: "New Test",
  init: function(urlParams) {
    let root = new DocumentFragment();
    root.add("h3", {id: "page-title", innerHTML: this.title});
    root.importTemplate();
    let form = root.select("form");
    let message = form.querySelector("#message");

    function upload(data) {
      let xhr = new XMLHttpRequest();
      xhr.open('POST', '/saveNewTest', true);
      xhr.onload = function(event) {
        if (xhr.status == 200){
          message.innerHTML = "Test successfuly saved."
          message.style.color = "green";
        }
        else {
          message.innerHTML = "Test with this name already exists."
          message.style.color = "red";
        }
      };
      let progressBar = form.querySelector('progress');
      xhr.upload.onprogress = function(event) {
        if (event.lengthComputable) {
          progressBar.value = (event.loaded / event.total) * 100;
        }
      };
      xhr.send(data);
    }

    form.onsubmit = function(event){
      event.preventDefault();
      let formData = new FormData();
      let name = this.querySelector('input[type="text"]').value;
      formData.append("name", name.trim());
      formData.append("userName", App.userName);
      upload(formData);
    }

    return root;
  }
})
