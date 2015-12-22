function getRequest(options){
  request = new XMLHttpRequest();
  request.open("GET", options.url, true);
  request.send();
  request.onreadystatechange = function() {
    if (request.readyState == 4 && request.status == 200) {
      if (options.successHandler){
        options.successHandler(request.status);
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

function loadResources(){
  function sendWork(responseText){
    pageNames = responseText.split(",");
    loadResourcesWorker = new Worker("/Frontend/scripts/Webworkers/load_Pages.js");
    loadResourcesWorker.postMessage(pageNames);
  }
  getRequest({url: "/pageNames", successHandler: sendWork, errorHandler: null});
}

function dontLoadByWorker(pageName){
  loadResourcesWorker.postMessage(pageName);
}
