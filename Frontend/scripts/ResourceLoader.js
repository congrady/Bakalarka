'use strict';

var ResourceLoader = {
  load: function(neededResources, auth, callback){
    let unresolvedResourcesCounter = neededResources.length;
    let $head = document.getElementsByTagName('head')[0];
    for (let resourcePath of neededResources) {
      let $script = document.createElement('script');
      if auth {
        $script.src = resourcePath + "#" + sessionStorage.token;
      } else {
        $script.src = resourcePath;
      }
      $script.async = true;
      $script.onload = function(){
        unresolvedResourcesCounter -= 1;
        if (unresolvedResourcesCounter == 0){
          if (callback){
            callback();
          }
        }
      };
      $head.appendChild($script);
    }
  }
}
