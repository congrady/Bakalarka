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
