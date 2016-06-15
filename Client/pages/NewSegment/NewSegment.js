'use strict';

App.newPage({
  init: function () {
    let page = new DocumentFragment();
    page.add('h3', {id: 'page-title', innerHTML: 'New Segment'});
    page.importTemplate('NewSegment');
    let form = page.querySelector('#form');
    let testSelect = form.querySelector('#testSelect');
    let message = page.select('#message');
    
    let urlParamTestId = App.getUrlParam('testId');
    var testID;
    if (urlParamTestId) {
      page.select('#testSelect').style.display = 'none';
      page.select('#select_label').style.display = 'none';
    }
    else {
      App.dataHandler({dataName: 'TestName', action: function (data) {
        for (let test of data) {
          testSelect.innerHTML += `<option value = "${test.id}">${test.name}</option>`;
        }
      }})
    }
       
    function upload (data) {
      let xhr = new XMLHttpRequest();
      xhr.open('POST', '/AddNewSegment', true);
      xhr.onload = function (event) {
        if (xhr.status == 200) {
          if (urlParamTestId) {
            App.invalidateData('TestData', testID);
            App.navigate('/Test/' + urlParamTestId);
          } else {
            message.innerHTML = 'New segment successfuly saved.';
            message.style.color = 'green';
          }
        }
        else {
          message.innerHTML = 'Failed to add new segment.'
          message.style.color = 'red';
        }
      };
      let progressBar = form.querySelector('progress');
      xhr.upload.onprogress = function (event) {
        if (event.lengthComputable) {
          progressBar.value = (event.loaded / event.total) * 100;
        }
      };
      xhr.send(data);
    }

    form.onsubmit = function (event) {
      event.preventDefault();
      let video = this.querySelector('#video').files[0];
      if (!video.name.endsWith('.mp4')) {
        message.innerHTML = 'Incorrect file type. Please select .mp4 and .csv file';
        message.style.color = 'red';
        return
      }
      let et = this.querySelector('#et').files[0];
      if (!et.name.endsWith('.csv')) {
        message.innerHTML = 'Incorrect file type. Please select .mp4 and .csv file';
        message.style.color = 'red';
        return
      }
      let formData = new FormData();
      
      let selectElement = form.querySelector('#testSelect');
      testID = urlParamTestId ? 
        urlParamTestId : 
        selectElement.options[selectElement.selectedIndex].value;
      
      formData.append('video', video);
      formData.append('et', et);
      formData.append('testID', testID);
      formData.append('userName', App.userName);
      upload(formData);
    }

    let video = form.querySelector('#video');
    let et = form.querySelector('#et');
    let submit = form.querySelector('#submit');
    let videoSelected = false;
    let etSelected = false;
    video.onchange = function () {
      videoSelected = true;
      if (videoSelected && etSelected) {
        submit.disabled = false;
      }
    };
    et.onchange = function () {
      etSelected = true;
      if (videoSelected && etSelected) {
        submit.disabled = false;
      }
    };

    return page;
  }
})
