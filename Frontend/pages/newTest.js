'use strict';

App.newPage({
  title: "New Test",
  init: function(urlParams) {
    let root = new DocumentFragment();
    root.add({elementType: "h3", id: "page-title", innerHTML: this.title});
    root.importTemplate();
    let form = root.select("form");
    let select = form.querySelector("#category");

    function upload(data) {
      let xhr = new XMLHttpRequest();
      xhr.open('POST', '/saveNewTest', true);
      xhr.onload = function(event) {
        alert(xhr.response);
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
      let category = select.options[select.selectedIndex].value;
      formData.append("file", file);
      formData.append("category", category);
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
