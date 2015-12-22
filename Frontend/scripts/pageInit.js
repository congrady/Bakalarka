'use strict';

function initRouter(){
  let routes = [
            {path: "/", handler: 'Home', navigation: false, isRelative: false},
            {path: "/Page1", handler: 'Page1', navigation: false, isRelative: false},
            {path: "/Page2", handler: 'Page2', navigation: false, isRelative: false}
            ];
  let router = new Router(routes);
  return router;
}
function servePage(){
  if (!router){
    initRouter();
  }
  router.servePage();
}

var router = initRouter()
router.servePage();
window.addEventListener('popstate', servePage);
