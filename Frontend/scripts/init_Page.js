function servePage(){
  if (!window["router"]){
    router = new Router(routes);
  }
  router.servePage();
}

function navigate(event){
  event.preventDefault();
  router.navigate(event.target.href.substring(21));
}

servePage();
window.addEventListener('popstate', servePage);
