'use strict';

var Authenticator = {
  userName: null,
  loginRequest: function(login, password, url, loginSuccessful, loginError){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    let params = encodeURI(`login=${login}&password=${password}`);
    var self = this;
    xhr.onload = function() {
      if (xhr.status == 200){
        let response = xhr.responseText.split(",");
        self.userName = response[0];
        sessionStorage.setItem('token', response[1]);
        loginSuccessful(self.userName);
      }
      else {
        loginError();
      }
    };
    xhr.onerror = function(){
      loginError();
    };
    xhr.send(params);
  }
}
