'use strict';

class Authenticator {
  constructor() {
    App.userName = sessionStorage.getItem('userName');
    App.token = sessionStorage.getItem('token');
    App.authLevel = sessionStorage.getItem('authLevel');
  }
  loginRequest(login, password, url, loginSuccessful, loginError) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    let params = encodeURI(`login=${login}&password=${password}`);
    var self = this;
    xhr.onload = function() {
      if (xhr.status == 200) {
        loginSuccessful(xhr.response);
      }
      else {
        loginError();
      }
    };
    xhr.onerror = function () {
      loginError();
    };
    xhr.send(params);
  }
}
