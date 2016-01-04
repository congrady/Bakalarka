'use strict';

var Authenticator = {
  token: null,
  loginRequest: function(options){
    var self = this;
    var request = new XMLHttpRequest();
    request.open("POST", options.url, true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    let params = `userName=${options.userName}&password=${options.password}`;
    request.onload = function() {
      let response = request.responseText.split(",");
      if (options.loginSuccessful){
        options.loginSuccessful(response[0]);
        this.token = response[1];
      }
    };
    request.onerror = function(){
      if (options.loginError){
        options.loginError();
      }
    };
    request.send(params);
  }
}
