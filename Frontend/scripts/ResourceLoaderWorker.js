'use strict';

addEventListener('message', function(message) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", message.data.url, true);
  let self = this;
  xhr.onload = function(response) {
    if (xhr.status == 200) {
      self.postMessage({"name": message.data.name, "response": this.response});
    }
    else if (xhr.status == 401){
      self.postMessage({"name": message.data.name, "response": "timeout"});
    }
  };
  xhr.onerror = function(){
    self.postMessage({"name": message.data.name, "response": "timeout"});
  }
  if (message.token){
    xhr.setRequestHeader('Authorization', 'Bearer ' + message.data.token);
  }
  xhr.send();
})
