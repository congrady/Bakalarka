function getRequest(options){
  request = new XMLHttpRequest();
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

function createFragment(template){
  var fragment = document.createDocumentFragment();
  var temp = document.createElement('body');
  temp.innerHTML = template;
  while(element = temp.firstElementChild){
    fragment.appendChild(element);
  }
  return fragment;
}
