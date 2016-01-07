'use strict';

var ResourceLoader = {
  loadScript: function(neededResources, successCallback, timeoutCallback){
    let unresolvedResourcesCounter = neededResources.length;
    let $head = document.getElementsByTagName('head')[0];
    for (let resourcePath of neededResources) {
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
  },
  loadRestrictedScript: function(neededResources, successCallback, unauthorizedCallback, timeoutCallback){
    let unresolvedResourcesCounter = neededResources.length;
    let $head = document.getElementsByTagName('head')[0];
    for (let resourcePath of neededResources) {
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
  }
}
