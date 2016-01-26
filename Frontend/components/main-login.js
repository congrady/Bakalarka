'use strict';

(function() {
  let template = `
  <style>
  p {
    padding-left: 2px;
    font-weight: bold;
    text-shadow:
      -0.5px -0.5px 0 #000,
      0.5px -0.5px 0 #000,
      -0.5px 0.5px 0 #000,
      0.5px 0.5px 0 #000;
    display: inline;
    font-size: 16px;
  }
  input[type="text"], input[type="password"] {
    padding: 0.4em;
    font-weight: bold;
    font-size: 15px;
    color: grey;
    width: 220px;
  }
  input[type="submit"], button{
    padding: 0.4em;
    font-weight: bold;
    font-size: 15px;
  }
  div {
    position: absolute;
    right: 2%;
    top: 20%;
  }
  </style>
  <div>
  <form>
    <p id="message"></p><br>
    <input name="login" type="text" value="Username" onfocus="this.value = '';" onblur="if (this.value == '') {this.value = 'Username';}"><br>
    <input name="password" type="password" value="Password" onfocus="this.value = '';" onblur="if (this.value == '') {this.value = 'Password';}"><br>
    <input type="submit">
  </form>
  </div>
  `;

  class MainLogin extends HTMLElement {
    createdCallback() {
      this.notLoggedInTemplate = `
      <form>
        <p id="message"></p><br>
        <input name="login" type="text" value="Username" onfocus="this.value = '';" onblur="if (this.value == '') {this.value = 'Username';}"><br>
        <input name="password" type="password" value="Password" onfocus="this.value = '';" onblur="if (this.value == '') {this.value = 'Password';}"><br>
        <input type="submit">
      </form>`;
      this.createShadowRoot().innerHTML = template;
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
      App.login({
        login: event.target.login.value,
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
      <p>You are logged in as:<br> ${userName}</p><br>
      <p><br></p>
      <button id="logout"><b>Logout</b></button>
      `;
      var self = this;
      this.shadowRoot.querySelector("#logout").onclick = function(){
        self.logout();
      }
      document.getElementsByTagName("main-navigation")[0].setAttribute("mode", "auth");
    }
    loginErrorCallback(){
      this.shadowRoot.getElementById("message").innerHTML = " Wrong username or password";

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
      document.getElementsByTagName("main-navigation")[0].setAttribute("mode", "free");
    }
  }
  document.registerElement('main-login', MainLogin);
})();
