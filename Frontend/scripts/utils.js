function get_request(options){
  if (options.async){
    request = new XMLHttpRequest();
    request.open("GET", options.url, true);
    request.send();
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        if (options.successHandler){
          options.successHandler(request.responseText);
        }
        return request.responseText;
      } else{
        if (options.errorHandler){
          options.errorHandler(request.status);
        }
      }
    }
  } else {
    request = new XMLHttpRequest();
    request.open("GET", options.url, false);
    request.send();
    if (request.status == 200){
      if (options.successHandler){
        options.successHandler(request.responseText);
      }
      return request.responseText;
    }
    else{
      if (options.errorHandler){
        options.errorHandler(request.status);
      }
    }
  }
}

function loadScript(url, callback)
{
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
