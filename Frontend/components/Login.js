'use strict';

(function() {

  let template = `
  <aside></aside>
  `;

  class MainLogin extends HTMLElement {
    createdCallback() {
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
      var self = this;
      this.$aside.querySelector('form').onsubmit = function(event){
        self.login(event);
      };
    };
    login(event) {
      event.preventDefault();
      var self = this;
      Authenticator.loginRequest(event.target.userName.value,
                                 event.target.password.value,
                                 "/login",
                                 function(userName){
                                   self.loggedInCallback(userName);
                                 },
                                 function(){
                                   self.loginErrorCallback();
                                   event.target.userName.value = "";
                                   event.target.password.value = "";
                                 });
    }
    loggedInCallback(userName){
      this.$aside.innerHTML = `
      <p>You are logged in as: ${userName}</p>
      <button>Logout</button>
      `;
      var self = this;
      this.$aside.querySelector("button").onclick = function(){
        self.$aside.innerHTML = self.notLoggedInTemplate;
        self.$aside.querySelector('form').onsubmit = function(event){
          self.login(event);
        };
      }
    }
    loginErrorCallback(){
      this.shadowRoot.getElementById("message").innerHTML = "Wrong username or password";
    }
  }
  document.registerElement('main-login', MainLogin);
})();


/*'use strict';

(function() {
  let template = `
    <p></p>
  `;
  class RandomElement extends HTMLElement {
    createdCallback() {
      this.createShadowRoot().innerHTML = template;
      this.$p = this.shadowRoot.querySelector('p');
      this.$p.innerHTML = "This message gets displayed, $p is accesible from here";
      this.changeElement();
    };
    changeElement(){
      this.$p.innerHTML = "$p is not visible, this message does not get displayed";
      this.showMessage();
    }
    showMessage(){
      this.$p.innerHTML = "fdogdfgfndsgdkjn";
    }
  }
  document.registerElement('random-element', RandomElement);
})();*/
