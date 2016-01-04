'use strict';

(function() {

  let template = `
  <aside></aside>
  `;

  class MainLogin extends HTMLElement {
    createdCallback() {
      var self = this;
      this.createShadowRoot().innerHTML = template;
      this.notLoggedInTemplate = `
      <form>
        <p id="message">Please, enter your login data</p>
        User name: <input name="userName" type="text">
        Password: <input name="password" type="password">
        <input type="submit">
      </form>
      `;
      this.$aside = this.shadowRoot.querySelector('aside');
      this.$aside.innerHTML = this.notLoggedInTemplate;
      this.$aside.querySelector('form').onsubmit = this.login;
    };
    login(event) {
      event.preventDefault();
      var self = this;
      Authenticator.loginRequest({userName: event.target.userName.value,
                                  password: event.target.password.value,
                                  url: "/login",
                                  loginSuccessful: function(userName){
                                    self.loggedInCallback(userName);
                                  },
                                  loginErrorCallback: function(){
                                    self.loginErrorCallback();
                                  }});
      event.target.userName.value = "";
      event.target.password.value = "";
    }
    loggedInCallback(userName){
      removeContents(this.$aside);
      this.$aside.innerHTML = `
      <p>You are logged in as: ${userName}</p>
      <button onclick="Authenticator.logout"></button>
      `;
    }
    loginErrorCallback(){
      this.shadowRoot.getElementById("message").innerHTML = "Wrong username or password";
    }
    logout() {
      removeContents(this.$aside);
      this.$aside.innerHTML = this.notLoggedInTemplate;
    }
  }
  document.registerElement('main-login', MainLogin);
})();
