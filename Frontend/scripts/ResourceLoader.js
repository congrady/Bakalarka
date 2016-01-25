'use strict';

class ResourceLoader {
  loadScript(neededResources, successCallback, timeoutCallback){
    let unresolvedResourcesCounter = neededResources.length;
    let $head = document.getElementsByTagName('head')[0];
    for (let resourcePath of neededResources) {
      if (resourcePath.endsWith('.js')){
        let $script = document.createElement('script');
        $script.src = resourcePath;
        $script.async = true;
        $script.onload = function(){
          unresolvedResourcesCounter -= 1;
          if (unresolvedResourcesCounter == 0){
            if (successCallback){
              successCallback();
            }
          }
        };
        $script.onerror = function() {
          if (timeoutCallback){
            timeoutCallback();
          }
        };
        $head.appendChild($script);
      }
      else if(resourcePath.endsWith(".html")){
        xhr_get({
            url: resourcePath,
            onsuccess: function(responseText){
              App.router.htmlSchemas.set(App.router.currentPage+"Template", responseText);
              unresolvedResourcesCounter -= 1;
              if (unresolvedResourcesCounter == 0){
                if (successCallback){
                  successCallback();
                }
              }
            },
            onerror: function(){
              if (timeoutCallback){
                timeoutCallback();
              }
            }
          }
        );
      }
    }
  }
  loadRestrictedScript(neededResources, successCallback, unauthorizedCallback, timeoutCallback){
    let unresolvedResourcesCounter = neededResources.length;
    let $head = document.getElementsByTagName('head')[0];
    for (let resourcePath of neededResources) {
      if (resourcePath.endsWith('.js')){
        let xhr = new XMLHttpRequest();
        xhr.open("GET", resourcePath, true);
        xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.token);
        xhr.onload = function() {
          if (unresolvedResourcesCounter == -1){
            return;
          }
          if (xhr.status == 200) {
            unresolvedResourcesCounter -= 1;
            let $script = document.createElement('script');
            $script.innerHTML = this.response;
            $head.appendChild($script);
            if (unresolvedResourcesCounter == 0){
              if (successCallback){
                successCallback();
              }
            }
          }
          else if (xhr.status == 401){
            unresolvedResourcesCounter = -1;
            unauthorizedCallback();
          }
        };
        xhr.onerror = function(){
          errorCallback();
        };
        xhr.send();
      }
      else if(resourcePath.endsWith(".html")){
        xhr_get({
            url: resourcePath,
            success: function(responseText){
              App.router.htmlSchemas.set(App.router.currentPage+"Schema", responseText);
              unresolvedResourcesCounter -= 1;
              if (unresolvedResourcesCounter == 0){
                if (successCallback){
                  successCallback();
                }
              }
            },
            error: function(){
              if (timeoutCallback){
                timeoutCallback();
              }
            }
          }
        );
      }
    }
  }
}
