'use strict';

App.newPage({
  title: "New Segment",
  init: function(urlParams) {
    let page = new DocumentFragment();
    page.add("h3", {id: "page-title", innerHTML: this.title});
    page.importTemplate();
    let form = page.select("form");
    let testName;
    if (urlParams){
      testName = urlParams[0];
    }
    else{
      xhr_get({
        url: "/GetTestNames",
        success: function(response){
          if (response == "null"){
            return;
          }
          let testNames = JSON.parse(response);
          let test = form.querySelector("#testSelect");
          for (let testName of testNames){
            test.innerHTML += `<option value = "${testName}">${testName}</option>`;
          }
        }
      });
    }

    function upload(data) {
      let xhr = new XMLHttpRequest();
      xhr.open('POST', '/AddNewSegment', true);
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
      let video = this.querySelector('#video').files[0];
      if (!video.name.endsWith(".mp4")){
        message.innerHTML = "Incorrect file type. Please select .mp4 and .csv file";
        message.style.color = "red";
        return
      }
      let et = this.querySelector('#et').files[0];
      if (!et.name.endsWith(".csv")){
        message.innerHTML = "Incorrect file type. Please select .mp4 and .csv file";
        message.style.color = "red";
        return
      }
      let formData = new FormData();
      let selectElement = form.querySelector('#testSelect');
      let testName = selectElement.options[selectElement.selectedIndex].value;
      formData.append("video", video);
      formData.append("et", et);
      formData.append("testName", testName);
      formData.append("userName", App.userName);
      upload(formData);
    }

    let video = form.querySelector('#video');
    let et = form.querySelector('#et');
    let submit = form.querySelector("#submit");
    let videoSelected = false;
    let etSelected = false;
    video.onchange = function(){
      videoSelected = true;
      if (videoSelected && etSelected){
        submit.disabled = false;
      }
    };
    et.onchange = function(){
      etSelected = true;
      if (videoSelected && etSelected){
        submit.disabled = false;
      }
    };

    return page;
  }
})