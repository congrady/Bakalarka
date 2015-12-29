'use strict';

var ResourceLoader = {
  load: function(neededResources, callback){
    var unresolvedResources = neededResources.length;
    let $head = document.getElementsByTagName('head')[0];
    for (let resourcePath of neededResources) {
      let $script = document.createElement('script');
      $script.src = resourcePath;
      $script.onreadystatechange = function(){
        unresolvedResources -= 1;
        if (unresolvedResources == 0){
          if (callback){
            callback();
          }
          return;
        }
      };
      $head.appendChild($script);
    }
    if (unresolvedResources == 0){
      if (callback){
        callback();
      }
    }
  }
}
