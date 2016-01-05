'use strict';

var Authenticator = {
  userName: null,
  loginRequest: function(login, password, url, loginSuccessful, loginError){
    var request = new XMLHttpRequest();
    request.open("POST", url, true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    let params = encodeURI(`login=${login}&password=${password}`);
    request.onload = function() {
      let response = request.responseText.split(",");
      this.userName = response[0];
      sessionStorage.setItem('token', response[1]);
      loginSuccessful(this.userName);
    };
    request.onerror = function(){
      loginError();
    };
    request.send(params);
  }
}
