//Deprecated version, using webworker to load script resources

servePage() {
  var routeParams = location.pathname.substring(1).split("/");
  var path = "/"+routeParams.shift();
  if (!this.routes.has(path)){
    document.getElementById('main-content').innerHTML = "Page does not exist.";
    return
  }
  var handler = this.routes.get(path).handler;
  if (window[handler]){
    window[handler].show();
    return
  }
  if (scriptsStoredInWorker.indexOf(handler) {
      loadScriptsWorker.postMessage(handler);
      loadScriptsWorker.onmessage = function(response) {
        window[handler] = new Page();
        eval(response.data);
        window[handler].show();
      }
  }
  else {
    loadScript(handler, function(){
      if (routeParams != ""){
        window[handler].init(routeParams);
      }
      else {
        window[handler].init();
      }
      window[handler].show();
    });
    if (typeof loadResourcesWorker === null){
      loadScriptsByWorker();
    }
  }
}

function loadScriptsByWorker(){
  scriptsStoredInWorker = []
  function sendWork(responseText){
    pageNames = responseText.split(",");
    loadResourcesWorker = new Worker("/Frontend/scripts/Webworkers/load_Pages.js");
    loadResourcesWorker.postMessage(pageNames);
  }
  getRequest({url: "/pageNames", successHandler: sendWork, errorHandler: null});
}

//getRequest({url: "/html", successHandler: function(text){alert(text);}, errorHandler: null});

/*

  SELECT t.name, t.added_by, t.uploaded_string, count(*) as "AMOUNT"
  FROM tests t
  JOIN segments s ON t.name = s.test_name
  GROUP BY t.name
  HAVING t.uploaded = (SELECT MAX(segments.uploaded)
                    FROM segments
                    WHERE t.name = s.test_name);

*/
