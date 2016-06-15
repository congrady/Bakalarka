'use strict';

function xhr_get(params) {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', params.url, true);
  xhr.onload = function () {
    if (xhr.status == 200) {
      if (params.success) {
        params.success(xhr.response);
      }
    }
    else if (xhr.status == 401) {
      if (params.unauthorized) {
        params.unauthorized();
      }
    } else if (xhr.status == 400) {
      if (params.badReqeust) {
        params.badRequest();
      }
    } else {
      if (params.otherError) {
        params.otherError();
      }
    }    
  };
  if (params.jwt) {
    xhr.setRequestHeader('Authorization', 'Bearer ' + params.jwt);
  }
  if (params.timeout) {
    xhr.onerror = function () {
      params.timeout();
    }
  }
  xhr.send();
}

function xhr_post(params) {
  let xhr = new XMLHttpRequest();
  let data = new FormData();
  for (let prop in params.data) {
    data.append(prop, params.data[prop])
  }
  xhr.open('POST', params.url, true);
  xhr.onload = function () {
    if (xhr.status == 200) {
      if (params.success) {
        params.success(xhr.response);
      }
    }
    else if (xhr.status == 401) {
      if (params.unauthorized) {
        params.unauthorized();
      }
    } else if (xhr.status == 400) {
      if (params.badReqeust) {
        params.badRequest();
      }
    } else {
      if (params.otherError) {
        params.otherError();
      }
    }
  };
  if (params.jwt) {
    xhr.setRequestHeader('Authorization', 'Bearer ' + params.jwt);
  }
  if (params.timeout) {
    xhr.onerror = function () {
      params.timeout();
    }
  }
  xhr.send(data);
}

String.prototype.capitalizeFirstLetter = function () {
  return this.charAt(0).toUpperCase() + this.substring(1);
}

DocumentFragment.prototype.select = function (queryString) {
  return this.querySelector(queryString);
}

function parseDate(string) {
  return new Date(Date.parse(string)).toLocaleString();
}

DocumentFragment.prototype.selectAll = function (queryString) {
  return this.querySelectorAll(queryString);
}
Element.prototype.selectAll = DocumentFragment.prototype.selectAll;

DocumentFragment.prototype.add = function (elementType, attrs, insertBefore) {
  if (!this){
    
  }
  if (App.router.registeredReactComponents.has(elementType)) {
    return ReactDOM.render(window[elementType](attrs), this);
  } else {
    let element = document.createElement(elementType);
    for (let attr in attrs) {
      if (attr == 'innerHTML') {
        element.innerHTML = attrs['innerHTML'];
      }
      else {
        element.setAttribute(attr, attrs[attr]);
      }
    }
    if (insertBefore) {
      this.insertBefore(element, this.firstChild)
    } else {
      this.appendChild(element);
    }
    return element;
  }
}
Element.prototype.add = DocumentFragment.prototype.add;

DocumentFragment.prototype.addImg = function (attrs, error) {
  let element = document.createElement('img');
  for (let attr in attrs) {
    element.setAttribute(attr, attrs[attr]);
  }
  element.onerror = function (response) {
    if (error == 'remove') {
      this.remove();
    } else if (error == 'hide') {
      this.hide();
    } else if (error == 'scaleDown') {
      this.setAttribute('width', 20);
      this.setAttribute('height', 20);
    }
  }
  this.appendChild(element);
  return element;
}
Element.prototype.addImg = DocumentFragment.prototype.addImg;


DocumentFragment.prototype.importTemplate = function (templateName) {
  let temp = document.createElement('body');
  if (templateName) {
    temp.innerHTML = App.router.htmlTemplates.get(templateName);
  }
  else {
    temp.innerHTML = App.router.htmlTemplates.get(App.router.currentPage);
  }
  let element;
  while (element = temp.firstElementChild) {
    this.appendChild(element);
  }
}
Element.prototype.importTemplate = DocumentFragment.prototype.importTemplate;

function createFragmentFromTemplate(template) {
  var fragment = document.createDocumentFragment();
  var temp = document.createElement('body');
  temp.innerHTML = template;
  let element;
  while (element = temp.firstElementChild) {
    fragment.appendChild(element);
  }
  return fragment;
}

Element.prototype.hide = function () {
  this.style.visibility = 'hidden';
}

Element.prototype.remove = function () {
  this.parentElement.removeChild(this);
}

function isRegisteredHTMLElement(name) {
  return document.createElement(name).constructor !== HTMLElement;
}

String.prototype.replaceAll = function (search, replacement) {
  return this.split(search).join(replacement);
}

function encodeURIWithUnderscores(str) {
  return str.replaceAll(' ', '__')
}

function encodeURIForUser(str) {
  return str.replaceAll(' ', '__')
}

function decodeURIWithUnderscores(str) {
  return str.replaceAll('__', ' ')
}

function encodeURIForServer(str) {
  return encodeURI(decodeURIWithUnderscores(str));
}

String.prototype.hashCode = function () {
  var hash = 0, i, chr, len;
  if (this.length === 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash;
}

function copy(obj){
  if (obj){
    if(typeof(obj) == 'string' || typeof(obj) == 'number' || typeof(obj) == 'boolean' || typeof(obj) == 'function'){
      return obj
    } else if (obj instanceof String) {
      return obj.slice(0, obj.length);
    } else {
      return Object.assign({}, obj);
    }
  }
}
