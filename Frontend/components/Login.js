'use strict';

(function() {

  class MainLogin extends HTMLElement {
    createdCallback() {
      this.notLoggedInTemplate = `
      <form>
        <p id="message">Please, enter your login data</p>
        User name: <input name="login" type="text">
        Password: <input name="password" type="password">
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
      Authenticator.loginRequest(event.target.login.value,
                                 event.target.password.value,
                                 "/login",
                                 function(userName){
                                   self.loggedInCallback(userName);
                                 },
                                 function(){
                                   self.loginErrorCallback();
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
      router.servePage();
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
      sessionStorage.removeItem('token');
      router.servePage();
    }
  }
  document.registerElement('main-login', MainLogin);
})();
