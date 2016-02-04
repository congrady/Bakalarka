'use strict';

class ResourceLoader {
  loadScript(neededResources, successCallback, timeoutCallback){
    let unresolvedResourcesCounter = neededResources.size;
    let $head = document.getElementsByTagName('head')[0];
    for (let resource of neededResources) {
      if (resource[1].endsWith('.js')){
        let $script = document.createElement('script');
        $script.src = resource[1];
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
      else if(resource[1].endsWith(".html")){
        xhr_get({
          url: resource[1],
          success: function(responseText){
            App.htmlTemplates.set(resource[0], responseText);
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
  loadRestrictedScript(neededResources, successCallback, unauthorizedCallback, timeoutCallback){
    let unresolvedResourcesCounter = neededResources.size;
    let $head = document.getElementsByTagName('head')[0];
    for (let resource of neededResources) {
      if (resource[1].endsWith('.js')){
        let xhr = new XMLHttpRequest();
        xhr.open("GET", resource[1], true);
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
      else if(resource[1].endsWith(".html")){
        xhr_get({
          url: resource[1],
          success: function(responseText){
            App.htmlTemplates.set(resource[0], responseText);
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
        });
      }
    }
  }
}
