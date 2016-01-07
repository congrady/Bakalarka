function servePage(){
  if (!window["router"]){
    router = new Router();
  }
  router.servePage();
}

function navigate(event){
  event.preventDefault();
  router.navigate(event.target.href.substring(21)); //todo
}

servePage();
window.addEventListener('popstate', servePage);
