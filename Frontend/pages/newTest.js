'use strict';

App.newPage({
  title: "New Test",
  init: function(urlParams) {
    let root = new DocumentFragment();
    root.add({elementType: "h3", id: "page-title", innerHTML: this.title});
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
      let file = this.querySelector('input[type="file"]').files[0];
      if (!file.name.endsWith(".mp4")){
        message.innerHTML = "Incorrect file type. Please select .mp4 video file";
        message.style.color = "red";
        return
      }
      let name = this.querySelector('input[type="text"]').value;
      formData.append("file", file);
      formData.append("name", name);
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
