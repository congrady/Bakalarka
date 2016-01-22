'use strict';

(function() {
  class MainLogin extends HTMLElement {
    createdCallback() {
      this.notLoggedInTemplate = `
      <style>
      p {
        font-weight: bold;
        text-shadow:
          -0.5px -0.5px 0 #000,
          0.5px -0.5px 0 #000,
          -0.5px 0.5px 0 #000,
          0.5px 0.5px 0 #000;
        display: inline;
        font-size: 17px;
      }
      input {
        float:right;
        clear:both;
      }
      input[type="submit"] {
        font-weight: bold;
        margin-top: 0.5%;
        font-size: 14px;
      }
      button {
        float:right;
        clear:both;
      }
      #message {
        text-align: right;
      }
      .align-right {
        text-align: right;
      }
      </style>
      <div>
      <form>
        <p id="message"></p><br>
        <p>Username: </p><input name="login" type="text"><br>
        <p>Password: </p><input name="password" type="password"><br>
        <input type="submit">
      </form>
      </div>
      `;
      this.createShadowRoot().innerHTML = this.notLoggedInTemplate;
      this.$form = this.shadowRoot.querySelector('form');
      this.root = this.shadowRoot.querySelector('div');
      var self = this;
      this.$form.onsubmit = function(event){
        self.login(event);
      };
    };
    login(event) {
      event.preventDefault();
      var self = this;
      App.login({login: event.target.login.value,
                 password: event.target.password.value,
                 success: function(userName){
                   self.loggedInCallback(userName);
                 },
                 error: function(){
                   self.loginErrorCallback();
                 }
                });
    }
    loggedInCallback(userName){
      this.root.innerHTML = `
      <br>
      <p .align-right>You are logged in as:<br> ${userName}<p><br>
      <button id="logout"><b>Logout</b></button>
      `;
      var self = this;
      this.shadowRoot.querySelector("#logout").onclick = function(){
        self.logout();
      }
    }
    loginErrorCallback(){
      this.shadowRoot.getElementById("message").innerHTML = "Wrong username or password";

      this.$form.login.value = "";
      this.$form.password.value = "";
    }
    logout(){
      this.root.innerHTML = this.notLoggedInTemplate;
      this.$form = this.shadowRoot.querySelector('form');
      this.$form.onsubmit = function(event){
        this.login(event);
      };
      App.logout();
    }
  }
  document.registerElement('main-login', MainLogin);
})();
