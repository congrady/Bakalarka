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
      }
      input {
        float:right;
        clear:both;
      }
      button {
        float:right;
        clear:both;
      }
      #message {
        text-align: right;
      }
      </style>
      <form>
        <p id="message"></p><br>
        <p>Username: </p><input name="login" type="text"><br>
        <p>Password: </p><input name="password" type="password"><br>
        <input type="submit">
      </form>
      `;
      this.createShadowRoot().innerHTML = this.notLoggedInTemplate;
      this.$form = this.shadowRoot.querySelector('form');
      var self = this;
      this.$form.onsubmit = function(event){
        self.login(event);
      };
    };
    login(event) {
      event.preventDefault();
      var self = this;
      router.login({login: event.target.login.value,
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
      this.shadowRoot.innerHTML = `
      <p>You are logged in as: ${userName}</p>
      <button id="logout">Logout</button>
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
      this.shadowRoot.innerHTML = this.notLoggedInTemplate;
      this.$form = this.shadowRoot.querySelector('form');
      this.$form.onsubmit = function(event){
        this.login(event);
      };
      router.logout();
    }
  }
  document.registerElement('main-login', MainLogin);
})();
