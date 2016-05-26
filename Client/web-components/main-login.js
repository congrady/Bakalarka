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
          `
         );
      }
      this.createShadowRoot().innerHTML = template;
      this.div = this.shadowRoot.querySelector('div');
      if (App.userName) {
        this.setAttribute('mode', 'loggedIn');
      }
      else {
        this.setAttribute('mode', 'notLoggedIn');
      }      
    };
    
    attachedCallback(){
    /*
      var self = this;  
      App.on({
        event: 'navigation', 
        id: App.getUniqueId(),
        callback: function(data){          
          console.log(data.message);
        }, 
      });*/
    }
    loggedInTemplate(userName){
      return `<br>
      <p>You are logged in as:<br> ${userName}</p>
      <br>
      <p><br></p>
      <button id="logout"><b>Logout</b></button>
      `;
    }
    login(event) {
      event.preventDefault();
      
      let login = event.target.login.value;
      let password = event.target.password.value;
      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/Login', true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      let params = encodeURI(`login=${login}&password=${password}`);
      var self = this;
      xhr.onload = function() {
        if (xhr.status == 200) {
          self.loginSuccessful(xhr.responseText);
        }
        else {
          self.loginErrorCallback();
        }
      };
      xhr.onerror = function () {
        self.loginErrorCallback();
      };
      xhr.send(params);
    }
    loginSuccessful(response){
      response = response.split(',');
      let userName = response[0];
      let token = response[1];
      let authLevel = response[2];
      App.login({userName: userName, token: token, authLevel: authLevel});
      sessionStorage.setItem('userName', userName);
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('authLevel', authLevel);
      App.login({userName: userName, token: token, authLevel: authLevel});
      App.reloadPage();
      this.setAttribute('mode', 'loggedIn');
    }
    loginErrorCallback(){
      this.shadowRoot.getElementById('message').innerHTML = ' Wrong username or password';
      this.$form.login.value = '';
      this.$form.password.value = '';
    }
    logout(){
      this.setAttribute('mode', 'notLoggedIn');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('userName');
      sessionStorage.removeItem('authLevel');
      App.logout();
      App.reloadPage();
    }
    show(mode){
      if (mode == 'notLoggedIn'){
        this.div.innerHTML = this.notLoggedInTemplate;
        this.$form = this.shadowRoot.querySelector('form');
        var self = this;
        this.$form.onsubmit = function(event){
          self.login(event);
        };
      }
      else if (mode == 'loggedIn') {
        this.div.innerHTML = this.loggedInTemplate(App.getUserName());
        var self = this;
        this.shadowRoot.querySelector('#logout').onclick = function(){
          self.logout();
        }
      }
    }
    attributeChangedCallback(attrName, oldVal, newVal) {
      if (attrName == 'mode'){
        this.show(newVal);
      }
    }
  }
  document.registerElement('main-login', MainLogin);
})();