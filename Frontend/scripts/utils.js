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

function loadScript(handler, callback){
  var url = "/Frontend/pages/"+handler+".js";
  var head = document.getElementsByTagName('head')[0];
  var script = document.createElement('script');
  script.type = 'application/javascript';
  script.src = url;
  
  if (callback){
    script.onreadystatechange = callback;
    script.onload = callback;
  }

  head.appendChild(script);
}
