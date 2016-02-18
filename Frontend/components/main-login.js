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
    box-shadow: 0 0 3px #000000;
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
      this.loggedInTemplate = function(userName){
        return(
          `
          <br>
          <p>You are logged in as:<br> ${userName}</p>
          <br>
          <p><br></p>
          <button id="logout"><b>Logout</b></button>
          `);
      }
      this.createShadowRoot().innerHTML = template;
      this.div = this.shadowRoot.querySelector('div');
      if (App.userName) {
        this.setAttribute("mode", "loggedIn");
      }
      else {
        this.setAttribute("mode", "notLoggedIn");
      }
    };
    /*
    attachedCallback(){
      if (App.username) {
        this.setAttribute("mode", "loggedIn");
      }
      else {
        this.setAttribute("mode", "notLoggedIn");
      }
    }*/
    loggedInTemplate(userName){
      return
      `<br>
      <p>You are logged in as:<br> ${userName}</p>
      <br>
      <p><br></p>
      <button id="logout"><b>Logout</b></button>
      `;
    }
    login(event) {
      event.preventDefault();
      var self = this;
      App.login({
        login: event.target.login.value,
        password: event.target.password.value,
        success: function(){
         self.setAttribute("mode", "loggedIn");
        },
        error: function(){
         self.loginErrorCallback();
        }
      });
    }
    loginErrorCallback(){
      this.shadowRoot.getElementById("message").innerHTML = " Wrong username or password";
      this.$form.login.value = "";
      this.$form.password.value = "";
    }
    show(mode){
      if (mode == "notLoggedIn"){
        this.div.innerHTML = this.notLoggedInTemplate;
        this.$form = this.shadowRoot.querySelector('form');
        var self = this;
        this.$form.onsubmit = function(event){
          self.login(event);
        };
      }
      else if (mode == "loggedIn") {
        this.div.innerHTML = this.loggedInTemplate(App.userName);
        var self = this;
        this.shadowRoot.querySelector("#logout").onclick = function(){
          self.setAttribute("mode", "notLoggedIn");
          App.logout();
        }
      }
    }
    attributeChangedCallback(attrName, oldVal, newVal) {
      if (attrName == "mode"){
        this.show(newVal);
      }
    }
  }
  document.registerElement('main-login', MainLogin);
})();
