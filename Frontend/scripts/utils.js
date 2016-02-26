'use strict';

function xhr_get(params){
  let xhr = new XMLHttpRequest();
  xhr.open("GET", params.url, true);
  xhr.onload = function() {
    if (xhr.status == 200) {
      if (params.success){
        params.success(xhr.response);
      }
    }
    else if (xhr.status == 401){
      if (params.unauthorized){
        params.unauthorized();
      }
    }
  };
  if (params.jwt){
    xhr.setRequestHeader('Authorization', 'Bearer ' + params.jwt);
  }
  if (params.timeout){
    xhr.onerror = function(){
      params.timeout();
    }
  }
  xhr.send();
}

String.prototype.capitalizeFirstLetter = function() {
  return this.charAt(0).toUpperCase() + this.substring(1);
}

DocumentFragment.prototype.select = function(queryString){
  if (queryString.charAt(0)=="#"){
    return this.getElementById(queryString.substring(1));
  }
  if (queryString.charAt(0)=="."){
    return this.getElementsByClassName(queryString.substring(1))[0];
  }
  return this.querySelector(queryString);
}
Element.prototype.select = DocumentFragment.prototype.select;
DocumentFragment.prototype.selectAll = function(queryString){
  return this.querySelectorAll(queryString);
}
Element.prototype.selectAll = DocumentFragment.prototype.selectAll;

DocumentFragment.prototype.add = function(elementType, attrs){
  let element = document.createElement(elementType);
  for (let attr in attrs){
    if (attr == "innerHTML"){
      element.innerHTML = attrs["innerHTML"];
    }
    else {
      element.setAttribute(attr, attrs[attr]);
    }
  }
  this.appendChild(element);
  return element;
}
Element.prototype.add = DocumentFragment.prototype.add;
DocumentFragment.prototype.addImg = function(url, attrs){
  let element = document.createElement("img");
  for (let attr in attrs){
    element.setAttribute(attr, attrs[attr]);
  }
  let hashCode = url.hashCode;
  element.setAttribute("id", hashCode)
  this.appendChild(element);

  let xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "blob";
  xhr.onload = function(response){
    let blob = new Blob([this.response], {type: "image/jpeg"});
    let imageURL = window.URL.createObjectURL(blob);
    document.getElementById(hashCode).src = imageURL;
    window.URL.revokeObjectURL(blob);
  }
  xhr.send();
}
Element.prototype.addImg = DocumentFragment.prototype.addImg;


DocumentFragment.prototype.importTemplate = function(templateName){
  let temp = document.createElement('body');
  if (templateName){
    temp.innerHTML = App.htmlTemplates.get(templateName);
  }
  else {
    temp.innerHTML = App.htmlTemplates.get(App.router.currentPage);
  }
  let element;
  while(element = temp.firstElementChild){
    this.appendChild(element);
  }
}
Element.prototype.importTemplate = DocumentFragment.prototype.importTemplate;

function createFragmentFromTemplate(template){
  var fragment = document.createDocumentFragment();
  var temp = document.createElement('body');
  temp.innerHTML = template;
  let element;
  while(element = temp.firstElementChild){
    fragment.appendChild(element);
  }
  return fragment;
}

function isRegistered(name) {
  return document.createElement(name).constructor !== HTMLElement;
}

String.prototype.replaceAll = function(search, replacement) {
    return this.split(search).join(replacement);
};

function encodeURIWithUnderscores(str){
  return str.replaceAll(" ", "__")
}

function encodeURIForUser(str){
  return str.replaceAll(" ", "__")
}

function decodeURIWithUnderscores(str){
  return str.replaceAll("__", " ")
}

function encodeURIForServer(str){
  return encodeURI(decodeURIWithUnderscores(str));
}

String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length === 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}
