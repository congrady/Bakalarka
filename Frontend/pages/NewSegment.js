'use strict';

App.newPage({
  title: "New Segment",
  init: function(urlParams) {
    let root = new DocumentFragment();
    root.add({elementType: "h3", id: "page-title", innerHTML: this.title});
    root.importTemplate();
    let form = root.select("form");
    let testName;
    if (urlParams){
      testName = urlParams[0];
    }
    else{
      xhr_get({
        url: "/getTestNames",
        success: function(json){
          let testNames = JSON.parse(json);
          let test = form.querySelector("#testSelect");
          for (let testName of testNames){
            test.innerHTML += `<option value = "${testName}">${testName}</option>`;
          }
        }
      });
    }

    function upload(data) {
      let xhr = new XMLHttpRequest();
      xhr.open('POST', '/addNewSegment', true);
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
      let file = this.querySelector('input[type="file"]').files[0];
      if (!file.name.endsWith(".csv")){
        message.innerHTML = "Incorrect file type. Please select .csv file";
        message.style.color = "red";
        return
      }
      let formData = new FormData();
      let selectElement = form.querySelector('#testSelect');
      let testName = selectElement.options[selectElement.selectedIndex].value;
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
