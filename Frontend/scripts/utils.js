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
      if (params.onunauthorized){
        params.unauthorized();
      }
    }
  };
  if (params.onerror){
    xhr.error = function(){
      params.onerror();
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

DocumentFragment.prototype.add = function(options){
  let element = document.createElement(options.elementType);
  if (options.innerHTML){
    element.innerHTML = options.innerHTML;
  }
  if (options.attributes){
    for (let attr in options.attributes){
      element.setAttribute(attr, options.attributes[attr]);
    }
  }
  if (options.insertBefore){
    this.insertBefore(element, options.insertBefore);
    return element;
  }
  this.appendChild(element);
  return element;
}
Element.prototype.add = DocumentFragment.prototype.add;

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

function encodeURIWithSlashes(str){
  return str.replaceAll(" ", "-")
}

function decodeURIWithSlashes(str){
  return str.replaceAll("-", " ")
}
