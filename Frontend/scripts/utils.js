'use strict';

function getRequest(options){
  let request = new XMLHttpRequest();
  request.open("GET", options.url, true);
  request.send();
  request.onreadystatechange = function() {
    if (request.readyState == 4 && request.status == 200) {
      if (options.successHandler){
        options.successHandler(request.responseText);
      }
      return request.responseText;
    }
    else {
      if (options.errorHandler){
        options.errorHandler(request.status);
      }
    }
  }
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

DocumentFragment.prototype.selectAll = function(queryString){
  return this.querySelectorAll(queryString);
}
DocumentFragment.prototype.add = function(options){
  let element = document.createElement(options.elementType);
  if (options.innerHTML){
    element.innerHTML = options.innerHTML;
  }
  if (options.id){
    element.id = options.id;
  }
  if (options.insertBefore){
    this.insertBefore(element, options.insertBefore);
    return element;
  }
  this.appendChild(element);
  return element;
}
Element.prototype.add = DocumentFragment.prototype.add;

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
