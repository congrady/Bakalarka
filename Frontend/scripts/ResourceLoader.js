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
          if (unresolvedResourcesCounter == -1){
            return
          }
          unresolvedResourcesCounter -= 1;
          if (unresolvedResourcesCounter == 0){
            successCallback();
          }
        };
        $script.onerror = function() {
          unresolvedResourcesCounter = -1;
          timeoutCallback();
        };
        $head.appendChild($script);
      }
      else if(resource[1].endsWith(".html")){
        xhr_get({
          url: resource[1],
          success: function(response){
            if (unresolvedResourcesCounter == -1){
              return
            }
            App.htmlTemplates.set(resource[0], response);
            unresolvedResourcesCounter -= 1;
            if (unresolvedResourcesCounter == 0){
              successCallback();
            }
          },
          timeout: function(){
            unresolvedResourcesCounter = -1;
            timeoutCallback();
          }
        });
      }
      else {
        xhr_get({
          url: resource[1],
          success: function(response){
            if (unresolvedResourcesCounter == -1){
              return
            }
            App.data[resource[0]] = JSON.parse(response);
            unresolvedResourcesCounter -= 1;
            if (unresolvedResourcesCounter == 0){
              successCallback();
            }
          },
          error: function(){
            unresolvedResourcesCounter = -1;
            timeoutCallback();
          }
        });
      }
    }
  }
  loadRestrictedScript(neededResources, successCallback, unauthorizedCallback, timeoutCallback){
    let unresolvedResourcesCounter = neededResources.size;
    let $head = document.getElementsByTagName('head')[0];
    for (let resource of neededResources) {
      if (resource[1].endsWith('.js')){
        xhr_get({
          url: resource[1],
          jwt: sessionStorage.token,
          success: function(response){
            if (unresolvedResourcesCounter == -1){
              return
            }
            let $script = document.createElement('script');
            $script.innerHTML = response;
            $head.appendChild($script);
            unresolvedResourcesCounter -= 1;
            if (unresolvedResourcesCounter == 0){
              successCallback();
            }
          },
          unauthorized: function(){
            unresolvedResourcesCounter = -1;
            unauthorizedCallback();
          },
          timeout: function(){
            unresolvedResourcesCounter = -1;
            timeoutCallback();
          }
        });
      }
      else if(resource[1].endsWith(".html")){
        xhr_get({
          url: resource[1],
          jwt: sessionStorage.token,
          success: function(response){
            alert(response);
            if (unresolvedResourcesCounter == -1){
              return
            }
            App.htmlTemplates.set(resource[0], response);
            unresolvedResourcesCounter -= 1;
            if (unresolvedResourcesCounter == 0){
              successCallback();
            }
          },
          unauthorized: function(){
            unresolvedResourcesCounter = -1;
            unauthorizedCallback();
          },
          timeout: function(){
            unresolvedResourcesCounter = -1;
            timeoutCallback();
          }
        });
      }
      else {
        xhr_get({
          url: resource[1],
          jwt: sessionStorage.token,
          success: function(response){
            alert(response);
            if (unresolvedResourcesCounter == -1){
              return
            }
            App.data[resource[0]] = JSON.parse(response);
            unresolvedResourcesCounter -= 1;
            if (unresolvedResourcesCounter == 0){
              successCallback();
            }
          },
          unauthorized: function(){
            unresolvedResourcesCounter = -1;
            unauthorizedCallback();
          },
          timeout: function(){
            unresolvedResourcesCounter = -1;
            timeoutCallback();
          }
        });
      }
    }
  }
}
