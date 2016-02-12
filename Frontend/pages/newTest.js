'use strict';

App.newPage({
  title: "New Test",
  init: function(urlParams) {
    let root = new DocumentFragment();
    root.add({elementType: "h3", id: "page-title", innerHTML: this.title});
    root.importTemplate();
    let form = root.select("form");

    function upload(data) {
      let xhr = new XMLHttpRequest();
      xhr.open('POST', '/saveNewTest', true);
      xhr.onload = function(event) {
        if (xhr.status == 409){
          form.querySelector("#message").innerHTML = "Test with this name already exists."
        }
        else {
          form.querySelector("#message").innerHTML = "Test successfuly saved."
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
      let file = this.querySelector('input[type="file"]').files[0];
      let testName = this.querySelector('input[type="text"]').value;
      formData.append("file", file);
      formData.append("testName", testName);
      formData.append("userName", App.userName);
      upload(formData);
    }
    let fileInput = form.querySelector('#fileInput');
    let submit = form.querySelector("#submit");
    fileInput.onchange = function(){
      submit.disabled = false;
    };

    return root;
  }
})
